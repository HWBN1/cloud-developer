import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query => done
  //    2. call filterImageFromURL(image_url) to filter the image => done
  //    3. send the resulting file in the response => done
  //    4. deletes any files on the server on finish of the response => done
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image => done
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful] => done

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get( "/filteredimage?:image_url", async ( req, res ) => {
    // read the url
    let { image_url } = req.query;
    // validate the query
    if ( !image_url ) {
      return res.status(400)
        .send(`image_url is required.`);
    }
    // filter the image
    const filtered_image = filterImageFromURL(image_url);
    // send the resulting file in the response
    filtered_image.then((filteredpath) => {
      // send the file as an octet stream.
      res.sendFile(filteredpath);
      // clean up tmp folders
      setTimeout(() => {
        deleteLocalFiles([filteredpath])
      }, 1000);
    }).catch(() => {
      res.status(422)
        .send(`invalid image_url.`);
    })
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();