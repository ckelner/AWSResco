# AWSResco
A standalone SPA using the client side AWS JS SDK to get instance and reservation info for JIT comparison of running infrastructure.

http://awsresco.s3-website-us-east-1.amazonaws.com/

## How it works
AWS Reservation Comparison (AWSResco) takes a look at AWS reservations for a given account and compares them against running infrastructure.  It combines multiple reservation purchases of the same `Instance Type`, `Availability Zone`, `Platform` (windows or linux), and `VPC` (EC2-Classic or VPC) into a single object, then looks at all running instances and matches them with any reservation based on the same values.

This information is then presented to the user as:
- The number of reservations of a given type, zone, platform, and vpc: `Reservation Count`
- The number of running instances of a given type, zone, platform, and vpc: `Running Instances`
- A differential, the number of reservations minus the number of running instances: `Differential`
- The hard data on each reservation & running instance sets: `Type`, `Zone`, `Windows`, `VPC`, `Runnings Ids`, and `Running Names`

# Security?
While AWSResco itself doesn't use HTTPS from S3 to the client's browser, all communication from the client's browser to AWS is over HTTPS.
This means that your access and secret keys are never sent from your browser over anything other than HTTPS.
This is enabled via [http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#sslEnabled-property](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#sslEnabled-property).

# AWS IAM Policy for access
The policy you use for AWSResco should follow the least privilege access rules.  In the case of AWSResco, the only access needed is for the the [describeInstances](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property) and the [describeReservedInstances](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeReservedInstances-property) API calls.  The following is an example of the policy to use:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1452989493668",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeReservedInstances"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
```

## Gaps
Currently AWSResco does not take into account `OfferingType`, it assumes that only `"Heavy Utilization"` is being used as that was the original use case for the tool.  There are plans to support all `OfferingType` variations - see [Issue#3](https://github.com/ckelner/AWSResco/issues/3).

## Screenshots
![img](readme-assets/images/pixelated_rescompare_v1.0.png?raw=true)

## Development
- Run with: `python -m SimpleHTTPServer` (or your favorite web server)
- Navigate to: `localhost:8000/dev.html` (or your favorite web server's configuration)

## Production build
- Run `sudo bash build.sh` which will uglify css and javascript

### Build Gaps
Changes to `dev.html` need to be copied to `index.html` at this time.
