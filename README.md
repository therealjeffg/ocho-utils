## OCHO Utilities

[![Build status](https://ci.appveyor.com/api/projects/status/063v38jv6lwoxq5e?svg=true)](https://ci.appveyor.com/project/therealjeffg/ocho-utils)

A utility module for translating csv data defining midi parameters from usercamp's data set
into JSON files for use in OCHO.

This utility scans a git checkout of the git
[repo](https://github.com/usercamp/midi) and produces the following artifacts:
* JSON cc parameter mappings in a format currently used by the alternative
[open-midi-rtc-schema](https://github.com/eokuwwy/open-midi-rtc-schema)
* when necessary, stub JSON files meant to contain meta-data for a given synth that is
used by the OCHO max for live device and other devices.

Basic functionality:

1. checkout or update git repos for open midi rtc and usercamp/midi
2. convert relevant csv format sources from midicamp to OMR json format
3. create stubs for any new hardware we're seeing

See license.txt for CCC details.
