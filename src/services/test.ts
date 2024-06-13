import { DataSource } from "typeorm"
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { pagination } from "typeorm-pagination";
import { Client } from "pg";
import { Users } from "./entities/User";


const main = async () => {
    const connection = new DataSource({
        type: 'postgres',
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB,
        entities: [Users]
    });
}


main()