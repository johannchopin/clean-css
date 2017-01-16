var assert = require('assert');
var vows = require('vows');

var wrapForOptimizing = require('../../../../lib/optimizer/wrap-for-optimizing').all;
var compatibility = require('../../../../lib/utils/compatibility');
var populateComponents = require('../../../../lib/optimizer/level-2/compacting/populate-components');
var validator = require('../../../../lib/optimizer/validator');

var overridesNonComponentShorthand = require('../../../../lib/optimizer/level-2/compacting/overrides-non-component-shorthand');

vows.describe(overridesNonComponentShorthand)
  .addBatch({
    'not matching': {
      'topic': function () {
        var left = wrapForOptimizing([
          [
            'property',
            ['property-name', 'margin'],
            ['property-value', '0px']
          ]
        ])[0];
        var right = wrapForOptimizing([
          [
            'property',
            ['property-name', 'padding-top'],
            ['property-value', '0px']
          ]
        ])[0];

        populateComponents([left], validator(compatibility({})), []);

        return [right, left];
      },
      'is false': function (topic) {
        assert.isFalse(overridesNonComponentShorthand.apply(null, topic));
      }
    },
    'border-color and border-<side>': {
      'topic': function () {
        var left = wrapForOptimizing([
          [
            'property',
            ['property-name', 'border-color'],
            ['property-value', 'red']
          ]
        ])[0];
        var right = wrapForOptimizing([
          [
            'property',
            ['property-name', 'border-top'],
            ['property-value', '1px'],
            ['property-value', 'solid'],
            ['property-value', 'red']
          ]
        ])[0];

        populateComponents([left], validator(compatibility({})), []);

        return [right, left];
      },
      'is false': function (topic) {
        assert.isFalse(overridesNonComponentShorthand.apply(null, topic));
      }
    },
    'border-<side> and border': {
      'topic': function () {
        var left = wrapForOptimizing([
          [
            'property',
            ['property-name', 'border-top'],
            ['property-value', '1px'],
            ['property-value', 'solid'],
            ['property-value', 'red']
          ]
        ])[0];
        var right = wrapForOptimizing([
          [
            'property',
            ['property-name', 'border'],
            ['property-value', '2px'],
            ['property-value', 'solid'],
            ['property-value', 'blue']
          ]
        ])[0];

        populateComponents([left], validator(compatibility({})), []);

        return [right, left];
      },
      'is true': function (topic) {
        assert.isTrue(overridesNonComponentShorthand.apply(null, topic));
      }
    }
  })
  .export(module);
