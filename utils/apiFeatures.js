class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const execludedFields = ['page', 'limit', 'sort', 'fields'];
    execludedFields.forEach(el => delete queryObject[el]);
    console.log(queryObject);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(?:gt|gte|lt|lte)\b/, match => `$${match}`);
    // console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr)); //this method retun a query not data
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortString = this.queryString.sort.split(',').join(' ');
      this.query.sort(sortString);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const limitString = this.queryString.fields.split(',').join(' ');
      this.query.select(limitString);
    } else {
      this.query.select('-__v');
    }
    return this;
  }

  pagginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    // console.log(`page:${page},limit${limit}`);
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
