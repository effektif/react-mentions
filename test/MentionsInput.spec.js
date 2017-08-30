import React from "react";
import { expect } from "chai";
import { mount } from "enzyme";

import { MentionsInput, Mention } from "../src";
import { _getTriggerRegex } from "../src/MentionsInput";

const data = [
    { id: "first", value: "First entry" },
    { id: "second", value: "Second entry" }
];

describe("MentionsInput", () => {

    let node;

    beforeEach(() => {
        node = mount(
            <MentionsInput value="">
                <Mention
                    trigger="@"
                    data={ data } />
            </MentionsInput>
        );
    });

    it("should render a textarea by default.", () => {
        expect(node.find("textarea")).to.have.length(1);
        expect(node.find("input")).to.have.length(0);
    });

    it("should render a regular input when singleLine is set to true.", () => {
        node.setProps({
            singleLine: true
        });

        expect(node.find("textarea")).to.have.length(0);
        expect(node.find("input")).to.have.length(1);
    });

    it("should show a list of suggestions once the trigger key has been entered.");
    it("should be possible to navigate through the suggestions with the up and down arrows.");
    it("should be possible to select a suggestion with enter.");
    it("should be possible to close the suggestions with esc.");

    it('should be able to handle sync responses from multiple mentions sources', () => {
        const wrapper = mount(
            <MentionsInput value="@">
                <Mention trigger="@" type="testentries" data={data} />
                <Mention
                    trigger="@"
                    type="testchars"
                    data={[ { id: "a", value: "A" }, { id: "b", value: "B" } ]}
                />
            </MentionsInput>
        )

        wrapper.find("textarea").simulate('focus')
        wrapper.find("textarea").simulate('select', {
            target: { selectionStart: 1, selectionEnd: 1 }
        })

        expect(wrapper.find('SuggestionsOverlay').find('Suggestion')).to.have.length(4)
    })

    describe("_getTriggerRegex", () => {
        it("should return regular expressions", () => {
            const trigger = /abc/
            expect(_getTriggerRegex(trigger)).to.equal(trigger)
        })

        it("should escape and capture a string trigger", () => {
            const result = _getTriggerRegex("trigger").toString()
            expect(result).to.equal("/(?:^|\\s)(trigger([^\\strigger]*))$/")
        })

        it("should allow spaces in search", () => {
            const result = _getTriggerRegex("trigger", {allowSpaceInQuery: true}).toString()
            expect(result).to.equal("/(?:^|\\s)(trigger([^trigger]*))$/")
        })
    })

    describe("spellCheck", () => {
        it("should render when input is plain text", () => {
            const wrapper = mount(
                <MentionsInput value="@" value="Example text" markup="{{__id__}}">
                    <Mention trigger="@" type="testentries" data={data} />
                </MentionsInput>
            )

            expect(wrapper.find('textarea').prop('spellCheck')).to.equal(true);
        });
        it("should render when input is plain text", () => {
            const wrapper = mount(
                <MentionsInput value="@" value="Example text {{__29409189109__}} with id" markup="{{__id__}}">
                    <Mention trigger="@" type="testentries" data={data} />
                </MentionsInput>
            )

            expect(wrapper.find('textarea').prop('spellCheck')).to.equal(false);
        });
        it("should work with hard coded true", () => {
            const wrapper = mount(
                <MentionsInput value="@" value="Example text {{__29409189109__}} with id" markup="{{__id__}}" spellCheck={true}>
                    <Mention trigger="@" type="testentries" data={data} />
                </MentionsInput>
            )

            expect(wrapper.find('textarea').prop('spellCheck')).to.equal(true);
        });

        it("should work with hard coded false", () => {
            const wrapper = mount(
                <MentionsInput value="@" value="Example text" markup="{{__id__}}" spellCheck={false}>
                    <Mention trigger="@" type="testentries" data={data} />
                </MentionsInput>
            )

            expect(wrapper.find('textarea').prop('spellCheck')).to.equal(false);
        });
    })
});
