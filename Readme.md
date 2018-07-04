# Sloth CLI 
Sloth CLI is dedicated for use with [slothking.online](https://slothking.online). It generates code from slothking node graphs. Our benchmarks show that it can speed up modern web apps development process up to 2000%. It is a huge step in system desing also. 

## Installation
```sh
$ npm install -g @slothking-online/sloth
```

## Login
```sh
$ sloth login <username> <password>
```
You have to login to use all features of this CLI

or if you don't have account and you haven't created one yet on [slothking.online](https://slothking.online)


## Register
```sh
$ sloth login <username> <password> <repeat_password>
```

This will log you in automatically of course too.

## Generate Code

As this is code generator, which generates code from slothking node graphs. For all examples we will use public user lib.

### Node Typescript Backend based on simple http server
Generate backend from node graph.
```sh
$ sloth nodets <project> <path>
```

<details>
  <summary>Examples (Click to expand)</summary>


  This generator generates code for your node typescript backend. You can try generating API for public user library to do so:

```ts
import * as sloth from "@slothking-online/node";
import * as tg from "typegoose";
import { ObjectId } from "bson";

export type UserType = {
  username: string;
  password: string;
  token: string;
}
export class User extends tg.Typegoose {
  @tg.prop() username: string;
  @tg.prop() password: string;
  @tg.prop() token: string;
}
export const Models = () => ({
  UserModel:new User().getModelForClass(User)
})

const slothking: {
  user: {
    name: string;
    middlewares: {
      isUser: sloth.SlothkingMiddleware<
        {
          token: string;
        },
        { 
          User: tg.InstanceType<User>;
        }
      >
    };
    endpoints: {
      refresh: sloth.SlothkingEndpoint<
        {
          token: string;
          username: string;
        },
        {},
        {
          username: string;
          token: string;
        }
      >;
      auth: sloth.SlothkingEndpoint<
        {
          token: string;
          username: string;
        },
        {},
        {
          username: string;
          token: string;
        }
      >;
      register: sloth.SlothkingEndpoint<
        {
          username: string;
          password: string;
        },
        {},
        {
          username: string;
          token: string;
        }
      >;
      login: sloth.SlothkingEndpoint<
        {
          username: string;
          password: string;
        },
        {},
        {
          username: string;
          token: string;
        }
      >;
      changePassword: sloth.SlothkingEndpoint<
        {
          password: string;
          newPassword: string;
        },
        {},
        {
          username: string;
          token: string;
        }
      >;
      resetPassword: sloth.SlothkingEndpoint<
        {
          username: string;
        },
        {},
        {}
      >;
      resetPasswordFromLink: sloth.SlothkingEndpoint<
        {
          newPassword: string;
          linkToken: string;
        },
        {},
        {}
      >;
      github: sloth.SlothkingEndpoint<
        {
          code: string;
        },
        {},
        {
          username: string;
          token: string;
        }
      >;
    };
  };
} = {
  user: {
    name: 'user',
    middlewares: {
      isUser: {
        name: "isUser"
      }
    },
    endpoints: {
      refresh: {
        path: "refresh",
        middlewares: []
      },
      auth: {
        path: "auth",
        middlewares: []
      },
      register: {
        path: "register",
        middlewares: []
      },
      login: {
        path: "login",
        middlewares: []
      },
      changePassword: {
        path: "changePassword",
        middlewares: []
      },
      resetPassword: {
        path: "resetPassword",
        middlewares: []
      },
      resetPasswordFromLink: {
        path: "resetPasswordFromLink",
        middlewares: []
      },
      github: {
        path: "github",
        middlewares: []
      }
    }
  }
};
export default slothking;
```

</details>


### Frontend fetch API
Generate from node graph.

```sh
$ sloth fetch-api <project> <path>
```

<details>
  <summary>Examples (Click to expand)</summary>

  This generator generates ready to use functions for your backend solution. You can try generating API for public user library to do so:


```sh
$ sloth fetch-api user user.ts
```

```ts
export type UserType = {
  username: string;
  password: string;
  token: string;
};
const slothking: {
  user: {
    name: string;
    endpoints: {
      refresh: (
        params: {
          host: string;
          props: {
            token: string;
            username: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{
        username: string;
        token: string;
      }>;
      auth: (
        params: {
          host: string;
          props: {
            token: string;
            username: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{
        username: string;
        token: string;
      }>;
      register: (
        params: {
          host: string;
          props: {
            username: string;
            password: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{
        username: string;
        token: string;
      }>;
      login: (
        params: {
          host: string;
          props: {
            username: string;
            password: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{
        username: string;
        token: string;
      }>;
      changePassword: (
        params: {
          host: string;
          props: {
            password: string;
            newPassword: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{
        username: string;
        token: string;
      }>;
      resetPassword: (
        params: {
          host: string;
          props: {
            username: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{}>;
      resetPasswordFromLink: (
        params: {
          host: string;
          props: {
            newPassword: string;
            linkToken: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{}>;
      github: (
        params: {
          host: string;
          props: {
            code: string;
          };
          method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
        }
      ) => Promise<{
        username: string;
        token: string;
      }>;
    };
  };
} = {
  user: {
    name: "user",
    endpoints: {
      refresh: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/refresh`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json()),
      auth: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/auth`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json()),
      register: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/register`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json()),
      login: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/login`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json()),
      changePassword: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/changePassword`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json()),
      resetPassword: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/resetPassword`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json()),
      resetPasswordFromLink: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/resetPasswordFromLink`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json()),
      github: ({ host, props, method = "POST" }) =>
        fetch(`${host}user/github`, {
          body: JSON.stringify(props),
          method
        }).then(res => res.json())
    }
  }
};
export default slothking;
```

</details>



### CoronaSDK lua api

```sh
$ sloth corona-sdk <project> <path>
```

### More generators

More generators will be added soon
