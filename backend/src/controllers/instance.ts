import logger from '../utils/logger';
import { NextFunction, Request, Response } from 'express';
import os from 'os';
import  nv from 'node-vault';

export const getInstanceInfo = (_req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        platform: os.platform(),
        architectre: os.arch(),
        hostname: os.hostname(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        homeDirectory: os.homedir(),
        tempDirectory: os.tmpdir(),
        cpuCores: os.cpus(),
        uptime: os.uptime(),
        loadAvg: os.loadavg(),
        userInfo: os.userInfo(),
        networkInterface: os.networkInterfaces(),
        endianness: os.endianness(),
        release: os.release(),
        eolChar: os.EOL,
    });
};

/**
 * Responds to a ping request with a pong message.
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @returns {void}
 */
export const ping = (_req: Request, res: Response) => {
    // Sends a 200 status code and a JSON response
    res.status(200).json({
        success: true,
        data: {
            message: 'pong',
            hostname: os.hostname(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
        },
    });
};

export const health = (_req: Request, res: Response, next: NextFunction) => {
    try {
        const year = new Date().getFullYear();
        logger.info(`Year is ${year}`);
        const month = new Date().getMonth();
        logger.info(`Month is ${month}`);
        const day = new Date().getDate();
        logger.info(`Day is ${day}`);
        res.status(200).json({
            success: true,
            data: {
                version: `${year}.${month}.${day}`,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const readVault = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const vault = nv( { apiVersion: 'v1', endpoint: process.env.VAULT_ADDR, token: process.env.VAULT_TOKEN });
        const response = await vault.read("astuto/rds")
        logger.info(response.data);

        res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        next(error);
    }
}
