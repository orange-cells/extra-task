import express from 'express';
import zlib from 'zlib';
import busboy from 'busboy';
import appSource from './app.js';

const app = appSource(express, zlib, busboy);

app.listen(process.env.PORT);
