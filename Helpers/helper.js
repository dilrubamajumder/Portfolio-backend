const nameCap = (book) => {
    let { title } = book;
    let processedTitle;
  
    let titleArr = title.split(" ").map((word) => {
      let normalizedWord = word.toLowerCase();
      let firstLetter = normalizedWord[0].toUpperCase();
      return firstLetter + normalizedWord.substring(1, normalizedWord.length);
    });
  
    processedTitle = titleArr.join(" ");
    return { ...book, title: processedTitle };
  };
  
  
  const checkBoolean = (req, res, next) => {
   
    if (
      req.body.is_favorite === true ||
      req.body.is_favorite === false ||
      req.body.is_favorite === undefined
    ) {
      next();
    } else {
      res.status(400).json({ error: "is_favorite must be a boolean value" });
    }
  };
  
  const checkTitle = (req, res, next) => {
    if (req.body.title) {
      next();
    } else {
      res.status(400).json({ error: "Book Title is required" });
    }
  };


const checkAuthor =  (req, res, next) => {
    if (req.body.author) {
      next();
    } else {
      res.status(400).json({ error: "Author name is required" });
    }
  };
 


  module.exports = { nameCap, checkBoolean, checkAuthor, checkTitle };