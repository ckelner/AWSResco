# AWSResco
A standalone SPA using the client side AWS JS SDK to get instance and reservation info for JIT comparison of running infrastructure.

## How it works
AWS Reservation Comparison (AWSResco) takes a look at AWS reservations for a given account and compares them against running infrastructure.  It combines multiple reservation purchases of the same `Instance Type`, `Availability Zone`, `Platform` (windows or linux), and `VPC` (EC2-Classic or VPC) into a single object, then looks at all running instances and matches them with any reservation based on the same values.

## Gaps
Currently AWSResco does not take into account `OfferingType`, it assumed that only `"Heavy Utilization"` is being used as that was my original use case.  There are plans to support all `OfferingType` - see [Issue#3](https://github.com/ckelner/AWSResco/issues/3).

## Screenshots
![img](readme-assets/images/pixelated_rescompare.png?raw=true)

## Development
- Run with: `python -m SimpleHTTPServer`
- Navigate to: `localhost:8000`
