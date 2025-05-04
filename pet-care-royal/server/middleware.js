const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer','');
    if (!token) return res.status(401).json({ message: 'No token provided'});

    try {
      const decoded = jwt.verify(token, process.env,JWT_SECRET);
      req.user = secoded;
      next();
    } catch (err){
        res.status(401),json({ message: 'Invalid token' });
    }
};

const role = (roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)){
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};
module.exports ={ auth, role };
// mañana sigo con esto nose si funcionara pero tengo fe que si va 
//funcionar o eso creo me gusta el gato que esta tecleando de la 
//extencion que descargue jaja me parece gracioso 