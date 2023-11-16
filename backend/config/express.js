import Express from 'express';
import RedirectIfAuthenticated from 'app/http/middleware/RedirectIfAuthenticated';
import Authenticated from 'app/http/middleware/Authenticated';
import path from 'path';

export default class {
    constructor(props) {
        this.server = Express();
        this.host = process.env.EXPRESS_HOST || props?.host || 'localhost';
        this.port = process.env.EXPRESS_PORT || props?.port || '3001';
    }

    start() {
        this.instance = this.server.listen(this.port, this.host, () => this.callback(this.instance));
    }

    processRoutes(routes) {
        routes.forEach((route) => {
            if (route instanceof Array) {
                switch (route[0]) {
                    case 'GET' || 'get':
                        this.server.get(route[1], route[2]);
                        break;
                    case 'POST' || 'post':
                        this.server.post(route[1], route[2]);
                        break;
                    case 'PUT' || 'put':
                        this.server.put(route[1], route[2]);
                        break;
                    case 'PATCH' || 'patch':
                        this.server.patch(route[1], route[2]);
                        break;
                    case 'DELETE' || 'delete':
                        this.server.delete(route[1], route[2]);
                        break;
                }
            } else if (route instanceof Object) {
                let middleware;

                if (route.middleware === 'GUEST' || route.middleware === 'guest') middleware = RedirectIfAuthenticated;
                if (route.middleware === 'AUTH' || route.middleware === 'auth') middleware = Authenticated;

                route.children.forEach((route) => {
                    switch (route[0]) {
                        case 'GET' || 'get':
                            this.server.get(route[1], middleware, route[2]);
                            break;
                        case 'POST' || 'post':
                            this.server.post(route[1], middleware, route[2]);
                            break;
                        case 'PUT' || 'put':
                            this.server.put(route[1], middleware, route[2]);
                            break;
                        case 'PATCH' || 'patch':
                            this.server.patch(route[1], middleware, route[2]);
                            break;
                        case 'DELETE' || 'delete':
                            this.server.delete(route[1], middleware, route[2]);
                            break;
                    }
                });
            }
        });
    }
    setting(setting, param) {
        this.server.set(setting, param);
    }

    useProduction() {
        this.server.use(Express.static('../frontend/build'));
        this.server.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../', '../', 'frontend', 'build', 'index.html')); //point to production
        });
    }

    bodyParser(parser = Express.json({ limit: '50mb' })) {
        this.server.use(parser);
    }

    urlEncoded(parser = Express.urlencoded({ extended: true, limit: '50mb' })) {
        this.server.use(parser);
    }

    useMiddleware(callback) {
        this.server.use(callback);
    }

    customError() {
        this.server.use((error, req, res, next) => {
            res.status(error.status || 500);
            res.json(error);
        });
    }
}
