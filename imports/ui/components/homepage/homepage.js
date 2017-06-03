import './homepage.html';
import { Tweets } from '../../../api/tweets/tweets.js';
import { Keywords } from '../../../api/tweets/tweets.js';
import { TagSentiment_Map } from '../../../api/tweets/tweets.js';
import { Tag_Map } from '../../../api/tweets/tweets.js';
import { Date_Map } from '../../../api/tweets/tweets.js';
import { Meteor } from 'meteor/meteor';

Template.homeCurrentlyTracking.onCreated(function() {
    Meteor.subscribe('keywords');
});

Template.homeCurrentlyTracking.helpers({
    keywords() {
        return Keywords.find();
    }
});

Template.keywordPolarity.onCreated(function() {
    Meteor.call('tagSentiment');
    Meteor.subscribe('tagSentMap');
});

Template.keywordPolarity.helpers({
    sentimentMap() {
        return TagSentiment_Map.find();
    }
});

Template.homeCurrentlyTracking.events({
    'submit .keyword-add' (event) {
        event.preventDefault();

        const target = event.target;
        const keyword = target.keyword;

        Meteor.call('addKeyword', keyword.value, (error) => {
            if (error) {
                alert(error.error);
            } else {
                keyword.value = '';
            }
        });
    },
    'submit .keyword-remove' (event) {
        event.preventDefault();

        const target = event.target;
        const keyword = target.keyword;

        Meteor.call('removeKeyword', keyword.value, (error) => {
            if (error) {
                alert(error.error);
            } else {
                keyword.value = '';
            }
        });
    },
});

Template.homeKeywords.onCreated(function() {
    Meteor.call('tagCount');
    Meteor.subscribe('tweets.all');
    Meteor.subscribe('tagMap');
});

Template.homeKeywords.helpers({
    tagMap() {
        return Tag_Map.find();
    },
    numTweets() {
        return Tweets.find().count();
    }
});

Template.homeKeywords.events({
    'click .graphButton' (event) {
        event.preventDefault();
        const target = event.target;
        if (target.id != "overall") {
            Meteor.call('dateCount', target.id);
        } else {
            Meteor.call('dateCount', "");
        }
        d3.select("#lineChart").selectAll("svg").remove();
    },
});

Template.lineChart.onCreated(function() {
    Meteor.call('dateCount',"");
    Meteor.subscribe('dateMap');
});

Template.lineChart.rendered = function(){

	//Width and height
	var margin = {top: 25, right: 50, bottom: 25, left: 50},
		width = 900 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

    var format = d3.time.format("%d-%m-%Y");

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) {
			return x(new Date (d._id));
		})
		.y(function(d) {
			return y(d.value);
		});

	var svg = d3.select("#lineChart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")");

	svg.append("g")
		.attr("class", "y axis");

	Deps.autorun(function(){

		var dataset = Date_Map.find().fetch();

		var paths = svg.selectAll("path.line").data([dataset]);

		x.domain(d3.extent(dataset, function(d) { return new Date (d._id); }));
		y.domain([0,d3.max(dataset, function(d) { return d.value; })]);

		//Update X axis
		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);

		//Update Y axis
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);

		paths
			.enter()
			.append("path")
			.attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "#000000")
			.attr('d', line);

		paths
			.attr('d', line);

		paths
			.exit()
			.remove();
	});
};
