/**

A utility module for translating csv data defining midi parameters from usercamp's data set
into JSON files for use in OCHO.

This utility scans a git checkout of the git repo[1] and produces the following artifacts:
 * JSON cc parameter mappings in a format currently used by the alternative open-midi-rtc-schema
 * when necessary, stub JSON files meant to contain meta-data for a given synth
   that ise used by the OCHO max for live device and other devices.



[1] git@github.com:canuckistani/midi.git
**/
