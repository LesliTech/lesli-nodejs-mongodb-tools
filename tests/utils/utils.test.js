/*
Lesli

Copyright (c) 2020, Lesli Technologies, S. A.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

MongoDB tools for Node.js applications

Powered by https://www.lesli.tech
Building a better future, one line of code at a time.

@contact  <hello@lesli.tech>
@website  <https://lesli.tech>
@license  GPLv3 http://www.gnu.org/licenses/gpl-3.0.en.html

// · ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~     ~·~
// · 
*/


// · 
let assert = require("assert")


// · 
const { converter } = require("../../src/utils")


// · 
describe("utils.converter", () => {

    it("should convert undefined bytes to human format", done => {
        assert.equal(converter.bytes_to_human(), "0 bytes")
        done()
    })

    it("should convert null bytes to human format", done => {
        assert.equal(converter.bytes_to_human(null), "0 bytes")
        done()
    })

    it("should convert -10 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(-10), "0 bytes")
        done()
    })

    it("should convert 0 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(0), "0 bytes")
        done()
    })

    it("should convert 1 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(1), "1 bytes")
        done()
    })

    it("should convert 12 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(12), "12 bytes")
        done()
    })

    it("should convert 123 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(123), "123 bytes")
        done()
    })

    it("should convert 1234 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(1234), "1.21 kilobytes")
        done()
    })

    it("should convert 12345 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(12345), "12.06 kilobytes")
        done()
    })

    it("should convert 123456 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(123456), "120.56 kilobytes")
        done()
    })

    it("should convert 1234567 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(1234567), "1.18 megabytes")
        done()
    })

    it("should convert 12345678 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(12345678), "11.77 megabytes")
        done()
    })

    it("should convert 123456789 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(123456789), "117.74 megabytes")
        done()
    })

    it("should convert 1234567890 bytes to human format", done => {
        assert.equal(converter.bytes_to_human(1234567890), "1.15 gigabytes")
        done()
    })

})
