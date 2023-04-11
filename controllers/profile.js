const handleProfile = (req, res, db)=>{
    const { id } = req.params;
    db.select('*').from('users')
    .where({id})
    .then(users => {
        if (users.length){
            res.json(users[0]);
        } else {
        res.status(404).json('no such user')
        }
    })
    .catch(err => res.status(404).json('error'));
}

module.exports = {
    handleProfile: handleProfile
}