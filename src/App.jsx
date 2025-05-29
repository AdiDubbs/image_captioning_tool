import './App.css';
import React, {useRef, useState} from "react";
import {Button, Card, Container, FormControl, FormGroup, FormLabel} from "react-bootstrap";

function App() {

    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    const generateCaption = async (upload) => {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", upload);
      try {
        const res = await fetch("http://localhost:5000/caption", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        setCaption(result.caption || result.error);
        setLoading(false);
      } catch (err) {
        setCaption("Error generating caption");
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (e) => {
        const upload = e.target.files?.[0];
        setImage(URL.createObjectURL(upload));
        setCaption('');
        generateCaption(upload);
    };

    const handleInput = () => {
        inputRef.current.click();
    };

    return (
        <Container className="my-4 mx-4">
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h1> Image Captioning Tool </h1>
                <p> Upload an image to let our AI generate a caption </p>
                <Card className="card">
                    <FormGroup style={{width: "80%"}}>
                        <FormLabel className="upload-label" onClick={handleInput}>
                            {image ? "Change the image" : "Upload an image"}
                        </FormLabel>
                        <FormControl
                            type="file"
                            accept="image/jpeg, image/png"
                            style={{display: "none"}}
                            ref={inputRef}
                            onChange={handleChange}
                        />
                    </FormGroup>
                    {image && (
                        <img
                            src={image}
                            alt="preview"
                            className="preview-image"
                        />
                    )}
                    <p className="caption-style">
                        {loading ? "Generating caption ..." : caption}
                    </p>
                </Card>
            </div>
        </Container>
    );
}

export default App;
