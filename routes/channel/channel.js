var express = require('express');
var router = express.Router();
var isAuth = require('../../tools/auth-tools').isAuth;
var Permalinks = require('permalinks');
var mongoose = require('mongoose');
var Channel = mongoose.model('Channel');
var Message = mongoose.model('Message');
var User = mongoose.model('User');
var md = require('markdown-it')();


router.get('/create', isAuth, function (req, res) {
    res.render('channel/create', {message: req.flash('error')});
});

router.get('/chat/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {

        if (err) {
            throw err;
        }
        if (channel && req.user) {
            req.session.channel = channel;
            Message.find({'channel': channel}).sort({'creationDate': -1}).populate('author')
                .populate('channel')
                .populate('emotions').exec(function (err, messages) {

                if (messages) {


                    var isHere = false;
                    var isAdmin = false;
                    for (var i = 0; i < channel.authorizedMembers.length; i++) {
                        if (channel.authorizedMembers[i].id === req.user.id) {
                            isHere = true;
                        }
                    }

                    if (isHere) {

                        for (var o = 0; o < channel.adminMembers.length; o++) {
                            if (channel.adminMembers[o].id === req.user.id) {
                                isAdmin = true;
                            }
                        }
                        for (var y = 0; y < messages.length; y++) {
                            if (messages[y].censor === true) {
                                messages[y].context = md.render('__Censored Message__');
                            }
                            if (!messages[y].published) {
                                messages[y].context = md.render('__Deleted Message__');
                            }
                        }
                        res.render('channel/chat', {messages: messages, admin: isAdmin, markdown: md});

                    }
                    else {

                        res.redirect('/channel/all/');
                    }
                } else {

                    res.redirect('/channel/all/');

                }
            });

        } else {

            res.redirect('/channel/all/');
        }
    });
});

router.post('/create', isAuth, function (req, res) {
    const permalinks = new Permalinks();
    let nChannel = new Channel;
    Channel.findOne({'name': req.body.name}, function (err, channel) {
        if (err) {

            throw err;
        }
        if (channel) {

            res.redirect("/channel/info/" + channel.permalink);
            //  channel.authorizedMembers.push(req.user);
            //   channel.save();
        } else {
            nChannel.creationDate = new Date();
            nChannel.updateDate = new Date();
            nChannel.name = req.body.name;

            nChannel.adminMembers.push(req.user);
            nChannel.authorizedMembers.push(req.user);
            nChannel.privateChannel = false;
            nChannel.permalink = permalinks.format(':name', {
                name: req.body.name
            });
            nChannel.save(function (err) {
                if (err) {
                    throw err;
                }
            });


            res.redirect("/channel/info/" + nChannel.permalink);
        }
    });
});

router.get('/info/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {

        if (err) {
            throw err;
        }

        if (req.user && channel) {
            var isHere = false;
            for (var i = 0; i < channel.authorizedMembers.length; i++) {
                if (channel.authorizedMembers[i].id === req.user.id) {
                    isHere = true;
                }
            }
            if (isHere) {

                res.render('channel/info', {channel: channel});

            }
            else {

                res.redirect('/channel/all/');
            }
        } else {
            res.redirect('/channel/all/');
        }


    });

});

router.get('/all', isAuth, function (req, res) {
    Channel.find({}).populate('authorizedMembers').sort({'creationDate': -1}).populate("adminMembers").exec(function (err, channels) {

        if (err) {
            res.redirect('/')
        }
        else {
            res.render('channel/all', {channels: channels});
        }

    });

});

router.get('/join/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
            if (err) {
                throw err;
            }
            if (req.user && channel) {
                var isHere = false;
                var isBanned = false;
                for (var i = 0; i < channel.authorizedMembers.length; i++) {
                    if (channel.authorizedMembers[i].id === req.user.id) {
                        isHere = true;
                    }
                }
                for (var y = 0; y < channel.bannedMember.length; y++) {
                    if (!channel.bannedMember[y].id === req.user.id) {
                        isBanned = true;
                    }

                }

                if (isHere || isBanned) {
                    res.redirect('/channel/info/' + channel.permalink);

                } else {
                    channel.updateDate = new Date();
                    channel.authorizedMembers.push(req.user);
                    channel.save(function (err) {
                        if (err) {
                            console.error("****Merde****");
                            throw err;
                        }
                    });
                    res.redirect('/channel/info/' + channel.permalink);
                    //res.render('channel/info', {channel: channel});
                }
            }
            else {

                res.redirect('/channel/all');
            }
        }
    );
});

router.post('/quit/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
            if (err) {
                throw err;
            }
            if (req.user && channel) {
                var isHere = false;
                var isAdmin = false;
                var notAlone = false;
                for (var i = 0; i < channel.authorizedMembers.length; i++) {
                    if (channel.authorizedMembers[i].id === req.user.id) {
                        isHere = true;
                    }
                }
                for (var y = 0; y < channel.adminMembers.length; y++) {
                    if (channel.adminMembers[y].id === req.user.id) {
                        isAdmin = true;
                    }
                }
                if (isAdmin) {
                    if (channel.adminMembers.length > 1) {
                        notAlone = true;
                        channel.adminMembers.remove(req.user);

                    }
                }
                if (isHere && !isAdmin ||
                    isHere && isAdmin && notAlone) {
                    channel.authorizedMembers.remove(req.user);
                    channel.save(function (err) {
                        if (err) {

                            throw err;
                        }
                    });
                    //Need to redirect to the channel
                    res.redirect('/channel/chat/' + channel.permalink);
                    //  res.render('channel/info', {channel: channel});

                } else {

                    res.redirect('/channel/info/' + channel.permalink);
                }
            }
            else {

                res.redirect('/channel/all');
            }
        }
    );
});

//Routes admin of the channel
router.get('/admin/be-admin/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }
        if (req.user && channel) {
            var isHere = false;
            for (var i = 0; i < channel.adminMembers.length; i++) {
                if (channel.adminMembers[i].id === req.user.id) {
                    isHere = true;
                }
            }

            if (isHere) {

                res.render('channel/admin/be-admin', {channel: channel});

            } else {

                res.redirect('/channel/info/' + channel.permalink);
            }
        }
        else {

            res.redirect('/channel/all');
        }

    });

});

router.post('/admin/be-admin/:permalink', isAuth, function (req, res) {


    Channel.findOne({permalink: req.params.permalink}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }

        if (req.user && channel) {
            var isAdmin = false;
            for (var y = 0; y < channel.adminMembers.length; y++) {
                if (channel.adminMembers[y].id === req.body.admin) {
                    isAdmin = true;
                }
            }
            if (isAdmin) {

                res.redirect('/channel/info/' + channel.permalink);

            } else {
                User.findById(req.body.admin, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        channel.adminMembers.push(user);
                        channel.save(function (err) {
                            if (err) {

                                throw err;
                            }
                        });
                    }
                });

                res.redirect('/channel/info/' + channel.permalink);
            }
        } else {

            res.redirect('/channel/all');
        }
    });
});

router.get('/admin/delete-user/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }
        if (req.user && channel) {
            var isHere = false;
            for (var i = 0; i < channel.adminMembers.length; i++) {
                if (channel.adminMembers[i].id === req.user.id) {
                    isHere = true;
                }
            }

            if (isHere) {


                res.render('channel/admin/delete-user', {channel: channel});

            } else {

                res.redirect('/channel/info/' + channel.permalink);
            }
        }
        else {

            res.redirect('/channel/all');
        }

    });
});

router.post('/admin/delete-user/:permalink', isAuth, function (req, res) {


    Channel.findOne({permalink: req.params.permalink}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }


        if (req.user && channel) {
            var isOkToDelete = false;
            var isAdmin = false;
            for (var i = 0; i < channel.authorizedMembers.length; i++) {
                if (channel.authorizedMembers[i].id === req.body.todelete) {
                    isOkToDelete = true;
                }
            }
            for (var y = 0; y < channel.adminMembers.length; y++) {
                if (channel.adminMembers[y].id === req.user.id) {
                    isAdmin = true;
                }
            }
            if (isOkToDelete) {

                User.findById(req.body.todelete, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        if (isAdmin) {
                            channel.adminMembers.remove(user);
                        }
                        channel.authorizedMembers.remove(user);
                        channel.save(function (err) {
                            if (err) {

                                throw err;
                            }
                        });
                        Message.find({'author': user}).sort({'creationDate': -1}).populate('author')
                            .populate('channel')
                            .populate('emotions').exec(function (err, messages) {
                            for (var i = 0; i < messages.length; i++) {
                                messages[i].published = false;
                                messages[i].save(function (err) {
                                    if (err) {

                                        throw err;
                                    }
                                });
                            }
                        });
                        user.isActivated = false;
                        user.save(function (err) {
                            if (err) {

                                throw err;
                            }
                        });
                    }
                });

                res.redirect('/channel/info/' + channel.permalink);

            } else {
                /**/

                res.redirect('/channel/all');
            }
        }
    });
});

router.get('/admin/censor-user/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }
        if (req.user && channel) {
            var isHere = false;
            for (var i = 0; i < channel.adminMembers.length; i++) {
                if (channel.adminMembers[i].id === req.user.id) {
                    isHere = true;
                }
            }

            if (isHere) {

                res.render('channel/admin/censor-user', {channel: channel});

            } else {

                res.redirect('/channel/info/' + channel.permalink);
            }
        }
        else {

            res.redirect('/channel/all');
        }

    });
});

router.post('/admin/censor-user/:permalink', isAuth, function (req, res) {


    Channel.findOne({permalink: req.params.permalink}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }


        if (req.user && channel) {
            var isOkToCensor = false;
            var isAdmin = false;
            for (var i = 0; i < channel.authorizedMembers.length; i++) {
                if (channel.authorizedMembers[i].id === req.body.tocensor) {
                    isOkToCensor = true;
                }
            }
            for (var y = 0; y < channel.adminMembers.length; y++) {
                if (channel.adminMembers[y].id === req.user.id) {
                    isAdmin = true;
                }
            }
            if (isOkToCensor) {

                User.findById(req.body.tocensor, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        if (isAdmin) {
                            channel.adminMembers.remove(user);
                        }
                        channel.save(function (err) {
                            if (err) {

                                throw err;
                            }
                        });
                        Message.find({'author': user}).sort({'creationDate': -1}).populate('author')
                            .populate('channel')
                            .populate('emotions').exec(function (err, messages) {
                            for (var i = 0; i < messages.length; i++) {
                                messages[i].censor = true;
                                messages[i].save();
                            }
                        });
                        user.censor = true;
                        user.save(function (err) {
                            if (err) {

                                throw err;
                            }
                        });

                    }
                });

                res.redirect('/channel/info/' + channel.permalink);

            } else {
                /**/

                res.redirect('/channel/all');
            }
        }
    });
});

router.get('/admin/kick-user/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }
        if (req.user && channel) {
            var isHere = false;
            for (var i = 0; i < channel.adminMembers.length; i++) {
                if (channel.adminMembers[i].id === req.user.id) {
                    isHere = true;
                }
            }

            if (isHere) {

                res.render('channel/admin/kick-user', {channel: channel});

            } else {

                res.redirect('/channel/info/' + channel.permalink);
            }
        }
        else {

            res.redirect('/channel/all');
        }

    });
});

router.post('/admin/kick-user/:permalink', isAuth, function (req, res) {


    Channel.findOne({permalink: req.params.permalink}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }


        if (req.user && channel) {
            var isOkToKick = false;
            var isAdmin = false;
            for (var i = 0; i < channel.authorizedMembers.length; i++) {
                if (channel.authorizedMembers[i].id === req.body.tokick) {
                    isOkToKick = true;
                }
            }
            for (var y = 0; y < channel.adminMembers.length; y++) {
                if (channel.adminMembers[y].id === req.body.tokick) {
                    isAdmin = true;
                }
            }
            if (isOkToKick) {

                User.findById(req.body.tokick, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        if (isAdmin) {
                            channel.adminMembers.remove(user);
                        }
                        channel.authorizedMembers.remove(user);

                        channel.save(function (err) {
                            if (err) {

                                throw err;
                            }
                        });
                        user.kicked++;
                        user.save(function (err) {
                            if (err) {

                                throw err;
                            }
                        });
                    }
                });

                res.redirect('/channel/info/' + channel.permalink);

            } else {

                res.redirect('/channel/all');
            }
        }
    });
});

router.get('/admin/ban-user/:permalink', isAuth, function (req, res) {
    Channel.findOne({permalink: req.params.permalink}).sort({'creationDate': -1}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }
        if (channel) {
            var isHere = false;
            for (var i = 0; i < channel.adminMembers.length; i++) {
                if (channel.adminMembers[i].id === req.user.id) {
                    isHere = true;
                }
            }

            if (isHere) {

                res.render('channel/admin/ban-user', {channel: channel});

            } else {


                res.redirect('/channel/info/' + channel.permalink);
            }
        }
        else {

            res.redirect('/channel/all');
        }

    });
});

router.post('/admin/ban-user/:permalink', isAuth, function (req, res) {

    Channel.findOne({permalink: req.params.permalink}).populate('authorizedMembers').populate("adminMembers").exec(function (err, channel) {
        if (err) {
            throw err;
        }

        if (req.user && channel) {
            var isOkToBan = false;
            var isAdmin = false;
            for (var i = 0; i < channel.authorizedMembers.length; i++) {
                if (channel.authorizedMembers[i].id === req.body.toban) {
                    isOkToBan = true;
                }
            }
            for (var y = 0; y < channel.adminMembers.length; y++) {
                if (channel.adminMembers[y].id === req.body.toban) {
                    isAdmin = true;
                }
            }
            if (isOkToBan) {
                User.findById(req.body.toban, function (err, user) {
                    if (err) {
                        throw err;
                    }
                    if (user) {
                        if (isAdmin) {
                            channel.adminMembers.remove(user);
                        }
                        channel.authorizedMembers.remove(user);
                        channel.bannedMember.push(user);
                        channel.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                        user.kicked++;
                        user.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    }
                });
                res.redirect('/channel/info/' + channel.permalink);

            } else {
                res.redirect('/channel/all');
            }
        }
    });
});


module.exports = router;

