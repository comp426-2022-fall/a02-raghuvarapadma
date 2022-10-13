#!/usr/bin/env node

import minimist from "minimist"
import moment from "moment-timezone"
import fetch from "node-fetch"
const args = minimist(process.argv.slice(2));


if (args.h === true) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE")
    console.log("    -h Show this help message and exit.")
    console.log("    -n, -s Latitude: N positive; S negative.")
    console.log("    -e, -w  Longitude: E positive; W negative.")
    console.log("    -z Time zone: uses tz.guess() from moment-timezone by default.")
    console.log("    -d 0-6 Day to retrieve weather: 0 is today; defaults to 1.")
    console.log("    -j Echo pretty JSON from open-meteo API and exit.")
} else {
    let timezone = moment.tz.guess();

    let longitude = 1;
    let latitude = 1;

    if (args.n) {
        latitude = args.n;
    }
    else if (args.s) {
        latitude = -args.s;
    }

    if (args.e) {
        longitude = args.e;
    }
    else if (args.w) {
        longitude = -args.w;
    }

    if (args.z) {
        timezone = args.z
    }

    let day = 1;

    if (args.d) {
        day = args.d;
    }
    console.log(day)

    let url = "https://api.open-meteo.com/v1/forecast?";
    url = url + 'latitude=' + latitude + '&longitude=' + longitude + "&timezone=" + timezone + "&daily=precipitation_hours"
    const response = await fetch(url);
    const data = await response.json();


    if (args.j) {
        console.log(data);
    } else {
        let precipitation = data.daily.precipitation_hours
        precipitation = precipitation[day];
        let string = ""
        if (precipitation > 0) {
            string += "You might need your galoshes "
        } else {
            string += "You will not need your galoshes "
        }
        if (day == 0) {
            string += "today."
        } else if (day == 1) {
            string += "tomorrow."
        } else {
            string += "in " + days + " days."
        }
        console.log(string)
    }
}
