// import express from 'express';
// import aws from 'aws-sdk';

const express = require('express');
const aws = require('aws-sdk');

const app = express();

app.get('/getObjects',(req,res) => {
    let prefix1 = req.query.prefix1;
    let prefix2 = req.query.prefix2;
    (async function() {
        try {
            aws.config.setPromisesDependency();
            aws.config.update({
                accessKeyId: "AKIAV3ZHCARQ4UZ3MZDG",
                secretAccessKey: "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",
                region: "us-east-1"
            })

            const s3 = new aws.S3();
            const response = await s3.listObjectsV2({
                Bucket: "robbit-mf",
                Prefix: prefix1 + "/" + prefix2 + "/"
            }).promise();

            let arr = {}

            await Promise.all(response.Contents.map(async (obj) => {
                let prefix = prefix1 + "/" + prefix2 + "/" + " ";
                let objectName = obj.Key.substring(prefix.length);
                objectName = objectName.replace(/\.[^/.]+$/, "")

                let json = await s3.getObject({
                    Bucket: "robbit-mf",
                    Key: obj.Key
                }).promise();

                arr[objectName] = JSON.parse(json.Body.toString('utf-8'))
            }));
            
            res.send(arr)

        } catch(e) {
            console.log("Error: Please see below lines")
            console.log(e)
        }
    })()
})

app.get('/', (req, res) => {
    res.send("Node REST API BackEnd")
})

app.listen(5000,() => {
    console.log("app is listening to port 5000");
})