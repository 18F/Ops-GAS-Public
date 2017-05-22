# Ops-GAS
A collection of Google Apps Scripts (GAS) used for 18F operations

# Summary
This repository contains [GAS](https://developers.google.com/apps-script/) files intended to perform a number of 18F operational tasks,
primarily focused on weekly business operations reporting.

# Data sources
These scripts rely on the following data sources:

- [Tock](https://github.com/18f/tock) (timecard and related information)
- [Float](https://float.com) (scheduled work information)
- [TTS Talent Database - v1.0](https://docs.google.com/spreadsheets/d/1JabICP7b0QtXOYa00dAW5m8n7YmEaWy5RVQ-7BrodC8/edit#gid=1388593896) (roster information)
- [18F financial information](https://docs.google.com/spreadsheets/d/1-ywKMdlZ3Of_IP32g3s0IG2Jxm3Eth6d87vvldS-Dvk/edit#gid=1433701190), including:
  - Revenue codes representing a set of labor rates, by GS grade level, by specified period;
  - Projects by revenue code, by reporting period; and
  - Employees by GS grade level, by specified period
- [18F billable hour goals](https://docs.google.com/spreadsheets/d/1ktKxwG8a-kWdYShKooQLnk-gc3FvhATMwO4xk-eefTI/edit#gid=1383049630)

# Requirements
- Access to Google Apps and ability to authorize the following OAuth Scopes:
  - https://mail.google.com/
  - https://www.googleapis.com/auth/drive
  - https://www.googleapis.com/auth/script.external_request
  - https://www.googleapis.com/auth/spreadsheets
  - https://www.googleapis.com/auth/userinfo.email
- A Tock API token
- A Float API token
- Access to the Google Sheets documents listed in [Data Sources](#data-sources)

# Testing
A bespoke basic testing client (`TestRunner.gs`) is included, along with unit and integration tests for the main libraries (i.e. `TestTock.gs` for the 
`TockLibrary.gs`, `TestFloat.gs` for the `FloatLibrary.gs`, etc...)

To execute all tests on an _ad hoc_ basis, run the `testRunner()` function in `TestRunner.gs`. This collects all `_test_...` functions, executes, and logs all results.

To set up automated tests, schedule a project trigger with the `autoTestRunner()` in `TestRunner.gs`. Results of automated tests are stored in the 
script cache via the `test_report` key. Results may also be emailed by modifying the `DEV_NOTIFICATIONS` and `PROJ_NAME` in `Settings.gs`. 
If any tests fail, the script cache's `test_status` key will return a `1`. *Note* that the script cache persists for ~6 hours only.

