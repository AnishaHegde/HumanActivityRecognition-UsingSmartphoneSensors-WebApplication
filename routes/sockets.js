module.exports = function(io) {

    io.sockets.on('connection', function (socket) {
        socket.on('user_data_event', function(data) {
            console.log(data);
            //socket.emit('Hello');
        });
    });
};