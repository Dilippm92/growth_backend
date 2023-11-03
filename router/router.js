const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const Website = require("../model/Data"); 

//api to post a url insight
router.post("/receive-data", async (req, res) => {
  const { websiteURL } = req.body;

  try {
    // Fetch the web content using Axios
    const response = await axios.get(websiteURL);
    const html = response.data;

    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);

    // Extract text content and calculate word count
    const textContent = $("body").text();
    const wordCount = textContent.split(/\s+/).length;

    // Extract links
    const webLinks = [];
    const mediaData = [];

    // Extract image URLs and details
    $("img").each((index, element) => {
      const src = $(element).attr("src");
      const alt = $(element).attr("alt");
      if (src && src.includes("suitejar.com")) {
        mediaData.push({
          type: "image",
          src,
          alt,
        });
      }
    });

    // Extract video URLs and details
    $("video").each((index, element) => {
      const src = $(element).attr("src");
      if (src && src.includes("suitejar.com")) {
        mediaData.push({
          type: "video",
          src,
        });
      }
    });

    // Extract web links
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        webLinks.push(href);
      }
    });

    // Create a new instance of the Website model
    const websiteData = new Website({
      url: websiteURL,
      wordCount,
      webLinks,
      mediaLinks: mediaData.map((media) => media.src), // Extract only the media URLs
    });

    // Save the data to the MongoDB database
    websiteData.save();

    // Respond with  a success message
    res.json({
      message: "Data received successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error while fetching and saving data" });
  }
});
//api to get all insights
router.get("/allinsights", async (req, res) => {
    try {
      // Use the find method to retrieve all insights from the database
      const allInsights = await Website.find();
  
      // Respond with the retrieved data
      res.json(allInsights);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error while retrieving data" });
    }
  });

  //api to update favourite items
  router.put('/updateFavorite/:id', async (req, res) => {
    try {
      const websiteId = req.params.id;
      const { isFavorite } = req.body;
      console.log(isFavorite);
  
      // Update the website's favorite status in the database
      const updatedWebsite = await Website.findByIdAndUpdate(
        websiteId,
        { isFavorite },
        { new: true }
      );

      if (!updatedWebsite) {
        return res.status(404).json({ error: 'Website not found' });
      }
      console.log(updatedWebsite);
      res.json(updatedWebsite);
    } catch (error) {
      console.error('Error updating favorite status:', error);
      res.status(500).json({ error: 'Error updating favorite status' });
    }
  });

  //api to delete data
  router.delete('/deleteItem/:id',async (req,res)=>{

    try {
      const websiteId = req.params.id;
      const deletedWebsite = await Website.findByIdAndDelete(websiteId);

      if (deletedWebsite) {
        res.json({ message: 'Data deleted successfully' });
      } else {
        res.status(404).json({ error: 'Data not found' });
      }

    } catch (error) {
      console.error('Error updating favorite status:', error);
      res.status(500).json({ error: 'Error deleting data' });
    }
  })
module.exports = router;
