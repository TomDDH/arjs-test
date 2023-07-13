import React, { useEffect, useRef, useState } from 'react';
import App from './App';
import TextField from '@mui/material/TextField';
import { Box, Button, Typography, Divider } from '@mui/material';
import S3 from "./AWConfigure";
import { Padding } from '@mui/icons-material';

function LoadApp() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const [AWSfile, setAWSFile] = useState()
    const [fileName, setFileName] = useState("target")
    const [error, setError] = useState(false)
    const uploadRef = useRef()
    const [validFile, setValidFile] = useState(0)
    const [fileUrl, setFileUrl] = useState(null)

    // console.log({ S3 })

    const redirectTo = (url) => {
        window.open(url, "_blank")
    }

    var params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME /* required */,
        Delimiter: "/",
    };
    S3.listObjects(params, function (err, data) {
        console.log({ err, data });

    });

    const startHandler = async () => {
        const key = `${fileName}.mind`
        setAWSFile(key)
        validTargeFile(key)
    }


    const validTargeFile = async (file_name) => {

        setError(false)
        // console.log(file_name)

        const key = file_name

        var params = {
            Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
            Key: key
        };

        S3.headObject(params, function (err, data) {
            if (err) {
                console.log(err)
                setError(true)
            } else {
                const url = `https://${process.env.REACT_APP_AWS_BUCKET_NAME}.s3.${process.env.REACT_APP_AWS_BUCKET_REGION}.amazonaws.com/${key}`
                setValidFile(200)
                setFileUrl(url)

                const queryParameters = new URLSearchParams(window.location.search)
                queryParameters.set("targetName", key);
                console.log(queryParameters.toString())
                // window.location.search = queryParameters.toString()

                var nexturl = new URL(window.location);
                nexturl.searchParams.set('targetName', key);

                window.history.replaceState(null, null, nexturl);


            }
        });

    }

    const uploadFile = (file) => {

        // console.log({ file })



        const indexFile = uploadRef.current.files[0]

        // console.log(indexFile)

        const key = indexFile.name

        const bucket = process.env.REACT_APP_AWS_BUCKET_NAME;
        // // const bucket = `webar-product/airdome/concept_name`
        console.log("uploading to " + bucket);
        const params = {
            Body: indexFile,
            Bucket: bucket,
            Key: key,
            ContentType: "binary/octet-stream",
        };
        S3.putObject(params)
            .on("httpUploadProgress", (evt) => {
                const amount = Math.round((evt.loaded / evt.total) * 100);
                console.log("uploading to production" + amount);
            })
            .send((err, data) => {
                if (err) {
                    console.log({ err })
                    // setFinished(index + 1);
                } else {
                    console.log({ data })
                    validTargeFile(key)
                }
            });
    }

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        const file = queryParameters.get("targetName")
        // console.log({ file })

        if (file) {
            validTargeFile(file)
            setAWSFile(file)
        }

    }, [])

    return (
        <React.Fragment>

            {fileUrl && <App url={fileUrl} />}
            {!fileUrl &&
                <Box
                    sx={{
                        width: "100vw",
                        height: '100vh',
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: "20px"
                    }}
                >
                    <Typography>Enter the target file name from AWS 3s bucket</Typography>
                    <Typography
                        sx={{
                            fontSize: "0.6rem"
                        }}
                    >https://public-wala-project-assets.s3.dualstack.us-east-1.amazonaws.com/</Typography>

                    <Box
                        sx={{
                            marginTop: "30px",
                            display: 'flex',
                            alignItems: "flex-end",
                            justifyContent: "center",
                            gap: "30px"
                        }}
                    >
                        <Box
                            sx={{
                                marginTop: "30px",
                                display: 'flex',
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                            }}
                        >
                            <TextField
                                onChange={(event) => {
                                    setFileName(event.target.value);
                                }}
                                id="standard-basic" value={fileName} label="target name" variant="standard" />
                            <Typography>.mind</Typography>
                        </Box>
                        <Button
                            sx={{
                                marginTop: "30px",
                            }}
                            variant="contained"
                            onClick={startHandler}>Start</Button>

                    </Box>

                    <Divider
                        sx={{
                            width: '100%',
                            padding: "20px",
                        }}
                    />



                    <Typography>Or upload a tained image target file</Typography>
                    <Button
                        variant="contained"
                        onClick={() => { redirectTo("https://hiukim.github.io/mind-ar-js-doc/tools/compile") }}
                    >
                        Go Generated a Target File
                    </Button>




                    <Button
                        variant="contained"
                        component="label"
                        color="secondary"
                    >
                        Upload Trained Target file
                        <Box
                            component="input"
                            type="file"
                            hidden
                            ref={uploadRef}
                            onChange={(event) => {
                                uploadFile(event.target.value);
                            }}
                        />
                    </Button>






                    {error && <Box
                        sx={{
                            marginTop: "50px",
                            color: "red"
                        }}
                    >Checking "{AWSfile}" File from AWS s3 has error, please check the file name</Box>}
                </Box>

            }


        </React.Fragment>
    );
}

export default LoadApp;
