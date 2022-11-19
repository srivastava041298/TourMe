const AppError = require('../utils/handleError');
const Tour=require('./../tourSchema');
const factory=require('./../controller/handlerFactory');

 exports.createTour=factory.createOne(Tour);
 exports.getAllTours=factory.getAll(Tour); 
 exports.updateTour=factory.updateOne(Tour);
 exports.getATour=factory.getOne(Tour,'reviews');

 exports.deleteTour=factory.deleteOne(Tour);
exports.getAllStats=async(req,res)=>{
    try{
        const stats=await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{startDates:{$gte:new Date("2021-01-01"),$lte:new Date("2021-12-31")}}
            },
            {
                $group:{_id:{$month:"$startDates"},numTour:{$sum:1},tour:{$push:"$name"}}
            },
            {
                $addFields:{month:"$_id",monthArray:[,'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']}
            },
            
            {
                $project:{_id:0,tour:1,numTour:1,monthName:{$arrayElemAt:['$monthArray','$month']}}
            },
            {
                $sort:{numTour:-1}
            }
        

        ])
        res.status(201).json({
            status:'success',
            data:{
                stats
            }
         })
            }
            
        catch(err)
        {
        res.status(404).json({
            status:'fail',
            meassage:'Invalid data!'
           
        })
    }
}
exports.getTourWithin=async (req,res,next)=>{
    try{
      const{distance,latlng,unit}=req.params;
      const [lat,lng]=latlng.split(',');
      const radiusInRadian=unit==='mi'?distance/3963.2:distance/6378.1;
      if(!lat ||!lng)
      {
        next(new AppError('Please provide latitude and longitude in format lat and lng!',400));
      }
      const tours=await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radiusInRadian]}}});
      res.status(200).json({
        status:'success',
        results:tours.length,
        data:{
            data:tours
        }
      })
    }
    catch(err)
    {
    res.status(404).json({
        status:'fail',
        meassage:'Invalid data!'
       
    })
}
}
exports.getDistances=async(req,res,next)=>{
    try{
        const{latlng,unit}=req.params;
        const [lat,lng]=latlng.split(',');
        const multiplier=unit==='mi'?0.00621:0.001;
        if(!lat ||!lng)
        {
          next(new AppError('Please provide latitude and longitude in format lat and lng!',400));
        }
        const distances=await Tour.aggregate([
            {
                $geoNear:{
                     near:{
                        type:'Point',
                        coordinates:[lng*1,lat*1]
                     },
                     distanceField:'distance',
                     distanceMultiplier:multiplier
                }
            },
            {
                $project:{distance:1,name:1}
            }

        ]);
        res.status(200).json({
            status:'success',
            data:{
                data:distances
            }
        })

    }
    catch(err)
    {
    res.status(404).json({
        status:'fail',
        meassage:'Invalid data!'
       
    })
    }
}