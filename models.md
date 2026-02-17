# Models of the application

Our different model for the rent management application.

Let's define the user story of our application

### User story

The user opens his `account`. He adds his `properties`, define the monthly rent amount of his property. The user add his `renter` and attributes him an amount for renting or hiring.

## Models

The first model is `Account` and it's defined by the differents fields:
-   `first_name`
-   `last_name`
-   `username`
-   `email`
-   `password`
-   `confirmed_password`
 
``` js

    const user = {
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        confirmedPassword:''
    }

```
Let's work to the next models; that consist in add the property.

