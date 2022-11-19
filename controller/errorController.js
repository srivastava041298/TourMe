
exports.errorMessage=(req,res)=>{
        res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });
}

