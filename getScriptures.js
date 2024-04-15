router.post("/getScriptures", async (req, res) => {
  try {
    const queryParams = req.query || {};
    
    // Create a filter function based on keywords provided in the POST request
    const getScripturesFilterFunction = () => ({ $or: [] });

    if (queryParams.q && queryParams.scripture === '') {
      // If q exists without explicit scripture selection, set default to Bible
      queryParams.scripture = 'Bible';
      getScripturesFilterFunction = getBookFilterFn("Bible");
    } else {
      getScripturesFilterFunction = getBookFilterFn(queryParams.scripture);
    }

    const [first] = await SearchedQuestion.find({})
      .filter(getScripturesFilterFunction)
      .sort({ timestamp: 1 })
      .skip(4)
      .limit(6);

    const results = [...first];

    res.status(200).json({
      verses: results.map(async (result) => {
        const script = ScriptureParser.parseFromQueryResult(result.query)[0];
        const scriptId = result._id;
        resul