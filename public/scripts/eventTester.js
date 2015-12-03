socket = io();

$(document).ready(function(){	
	$('#eventTesterForm').submit(function(e){
		e.preventDefault();
		fireEvent = $('#fireEvent').val();
		if(!fireEvent){
			fireEvent = 'dummy';
		}
		listenEvents = $('#listenEvent').val();
		if(!listenEvents){
			listenEvents = 'dummy';
		}else{
			listenEvents = listenEvents.split("-");
		}		
		fireMessage = $('#fireMessage').val();
		if(fireMessage){
			fireMessage = JSON.parse(fireMessage);		
		}else{
			fireMessage = new Object();
		}
		trigger = $('#trigger').val();		
		
		if(fireEvent != 'dummy'){
			console.log('listening on : '+fireEvent+'Response');
			socket.on(fireEvent+'Response',function(res){			
				console.log(fireEvent+'Response');
				console.log(res);
			});
		}
		if(listenEvents != 'dummy'){
			for(var i = 0 ; i < listenEvents.length ; i++){
				listenEvent = listenEvents[i];
				if(i==0){
					console.log('listening on : '+listenEvent+', with Trigger');
					socket.on(listenEvent, function(res){
						console.log(listenEvent);
						console.log(res);							
						eval(trigger);
					});
				}else{
					console.log('listening on : '+listenEvent);
					socket.on(listenEvent, function(res){
						console.log(listenEvent);
						console.log(res);
					});
				}			
			}
		}
		if(fireEvent != 'dummy'){
			console.log('firing : '+fireEvent+'Request');
			socket.emit(fireEvent+'Request', fireMessage);		
		}	
	});
});