# AWSResco
A standalone SPA using the client side AWS JS SDK to get instance and reservation info for JIT comparison of running infrastructure.

## How it works
AWS Reservation Comparison (AWSResco) takes a look at AWS reservations for a given account and compares them against running infrastructure.  It combines multiple reservation purchases of the same `Instance Type`, `Availability Zone`, `Platform` (windows or linux), and `VPC` (EC2-Classic or VPC) into a single object, then looks at all running instances and matches them with any reservation based on the same values.

This information is then presented to the user as:
- The number of reservations of a given type, zone, platform, and vpc: `Reservation Count`
- The number of running instances of a given type, zone, platform, and vpc: `Running Instances`
- A differential, the number of reservations minus the number of running instances: `Differential`
- The hard data on each reservation & running instance sets: `Type`, `Zone`, `Windows`, `VPC`, `Runnings Ids`, and `Running Names`

# Security?
While AWSResco itself isn't HTTPS, all communication with AWS is over HTTPS.
This means that your access and secret keys are never sent from your browser over anything other than HTTPS.
This is enabled via [http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#sslEnabled-property](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#sslEnabled-property).

## Gaps
Currently AWSResco does not take into account `OfferingType`, it assumed that only `"Heavy Utilization"` is being used as that was the original use case for the tool.  There are plans to support all `OfferingType` variations - see [Issue#3](https://github.com/ckelner/AWSResco/issues/3).

## Screenshots
![img](readme-assets/images/pixelated_rescompare.png?raw=true)

## Development
- Run with: `python -m SimpleHTTPServer` (or your favorite web server)
- Navigate to: `localhost:8000/dev.html` (or your favorite web server's configuration)

## Production build
- Run `sudo bash build.sh` which will uglify css and javascript

### Build Gaps
Changes to `dev.html` need to be copied to `index.html` at this time.
