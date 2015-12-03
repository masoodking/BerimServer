var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports ={
					register: function (req, res, next) {					
						var params = _.pick(req.body, 'password', 'phoneNumber', 'nickName');
						req.models.user.create(params, function (err, user) 
						{
							  if(err) 
							  {
									if(Array.isArray(err))
									{
									  console.log({errors: helpers.formatErrors(err) });
									  return res.send(600, {errors: helpers.formatErrors(err) });
									}
									else 
									{
									  return next(err);
									}
							  }
							  user = user.serialize();
							  console.log('user created!');
							  console.log(user);
							  // create a room for user
							  newRoom = new Object();
							  newRoom.name = user.nickName;
							  req.models.room.create(newRoom, function(err, room){								
								if(err)
								{
									if(Array.isArray(err))
									{
									  console.log({errors: helpers.formatErrors(err) });
									  return res.send(600, {errors: helpers.formatErrors(err) });
									}
									else 
									{
									  return next(err);
									}									
								}
								room = room.serialize();
								console.log('room created!');
								console.log(room);
								//insert new user to his own room
								newJoin = new Object();
								newJoin.userId = user.id;
								newJoin.roomId = room.id;
								req.models.join.create(newJoin, function(err, join){
									if(err)
									{
										if(Array.isArray(err))
										{
											console.log({errors: helpers.formatErrors(err) });
											return res.send(600, {errors: helpers.formatErrors(err) });
										}
										else 
										{
											return next(err);
										}									
									}
									join = join.serialize();
									console.log('join created!');
									console.log(join);
									
									return res.send(200, user);
								});
							  });							  							  
						});
					},
					signIn: function (req, res, next){
						var params = _.pick(req.body, 'phoneNumber','password');
						req.models.user.find(params, function (err, users) {
							if(users.length==0)			
							{								
								return res.send(600, 'Password or Phone number is incorrect!');															
							}else{
								user = users[0];
								user = user.serialize();
								console.log('user found!');
								console.log(user);								
								return res.send(200, user);
							}
						});
					},
					getRooms: function(req, res, next){
						var params = _.pick(req.body, 'userId');
						req.models.join.find(params, function(err, joins){														
							var rooms = new Array();
							for(var i = 0; i < joins.length; i++){
								join = joins[i];
								join = join.serialize();
								rooms.push(join.roomId);
							}						
							return res.send(200, rooms);
						});
					}
				};
