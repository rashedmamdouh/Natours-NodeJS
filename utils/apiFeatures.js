//ToutAPI Class
class APIFeatures {
    constructor(query,queryString){
        this.query=query; // QueryResult
        this.queryString=queryString; //QueryFilters
    }
    filter(){
        //1) Delete the excludedFields from the queryObj
        const queryObj={...this.queryString}
                    //console.log(queryObj) 
        const excludedFields=['page','sort','fields','limit']
        excludedFields.forEach(el=>delete queryObj[el])
                    //console.log(queryObj)

        //2) Advanced Filtering
        let advQuery=JSON.stringify(queryObj).replace(/\b(gte|lte|gt|lt)\b/g,match=>`$${match}`)
        this.query=this.query.find(JSON.parse(advQuery))
        return this; // to be called .().().()
    }
    sort(){
        //3) Sorting
        if(this.queryString.sort){
            const sortBy=this.queryString.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy);
            //sort(price ratingAverage)
        }else{
            this.query=this.query.sort('-createdAt');//- ===>Decsending
        }
        return this;
    }
    limiting(){
        //4) Field Limiting
        if(this.queryString.fields){
            const fields=this.queryString.fields.split(',').join(' ')
            this.query=this.query.select(fields);
        }else{
            this.query=this.query.select('-__v'); //every thing except
        }
        return this;
    }
    pagination(){
            //5) Pagination
            const page=this.queryString.page*1 || 1;
            const limit=this.queryString.limit*1 || 100;
            const skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit);
            return this;
    }
}

module.exports=APIFeatures;