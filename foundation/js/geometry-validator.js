window.GeometryValidator = {  
  validateRoom: function(pointIds, wallIds) { return { status: "ok" }; },  
  validateOpening: function(wallId, roomId, type, width, height, position) {  
    // заглушка  
    return { status: "ok" };  
  }  
};  