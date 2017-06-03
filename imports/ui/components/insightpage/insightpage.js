import './insightpage.html';

import { Meteor } from 'meteor/meteor';
import { Keywords } from '../../../api/tweets/tweets.js';
import { TagSentiment_Map } from '../../../api/tweets/tweets.js';
import { Location_Map } from '../../../api/tweets/tweets.js';
import { Token_Map } from '../../../api/tweets/tweets.js';
import { Language_Map } from '../../../api/tweets/tweets.js';
import { Date_Map } from '../../../api/tweets/tweets.js';
import { Tweets } from '../../../api/tweets/tweets.js';

Template.insightSearch.onCreated(function(){
    Meteor.subscribe('keywords');
});

Template.insightSearch.helpers({
    keywords() {
        return Keywords.find();
    },
});

Template.insightSearch.events({
    'click .searchBtn' (event) {
        event.preventDefault();
        const target = event.target;
        const id = target.id.toLowerCase();

        Session.set('showThings', true);
        Session.set('searchTerm', id);

        Meteor.call('locationCount',id);
        Meteor.call('tokenCount',id);
        Meteor.call('languageCount',id);
        Meteor.call('tagSentiment', id);

        d3.select("#languageGraph").remove();
        drawLangChart();

        d3.select("#locationGraph").remove();
        drawLocChart();
    },
});

Template.insightTokens.onCreated(function(){
    Meteor.subscribe('tokenMap', 10);
});

Template.insightTokens.helpers({
    tokenMap() {
        return Token_Map.find();
    }
});

Template.insightRecentTweets.onCreated(function(){
    var term = Session.get('searchTerm');
    Meteor.subscribe('tweets.show', term);
});

Template.insightRecentTweets.onRendered(function(){
    Tracker.autorun(function(){
        var term = Session.get('searchTerm');
        Meteor.subscribe('tweets.show', term);
    })
});

Template.insightRecentTweets.helpers({
    tweets() {
        return Tweets.find();
    }
});

Template.insightLanguages.onCreated(function(){
    var term = Session.get('searchTerm');
    Meteor.call('languageCount',term);
    Meteor.subscribe('languageMap');
});

function drawLangChart() {
    var margin = {top: 25, right: 50, bottom: 25, left: 75},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var body = d3.select("#languageGraphDiv");

    var svg = body.append("svg")
        .attr("id", "languageGraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

	Deps.autorun(function(){
		var data = Language_Map.find().fetch();

        x.domain(data.map(function(d) { return d._id; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        var bars = svg.selectAll(".bar").data(data, function(d){return d._id;});
        var texts = svg.selectAll(".text").data(data, function(d){return d._id;});

        svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);

		//Update Y axis
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);

        // texts
        //     .transition()
        //     .duration(1000);

        bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d._id); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

        texts
            .enter()
            .append("text")
            .attr("class", "text")
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "middle")
            .attr("font-size", "15px")
            .attr("x", function(d) { return x(d._id)+(x.rangeBand()/2); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("fill","red")
            .text(function(d){ return d.value; });

       bars
           .exit()
           .remove();

	});
}

Template.insightLanguages.rendered = function(){
    d3.select("#languageGraph").remove();
    drawLangChart();
};

Template.insightLocations.onCreated(function(){
    var term = Session.get('searchTerm');
    Meteor.call('locationCount', term)
    Meteor.subscribe('locationMap');
});

function drawLocChart() {
    var w = 500;
	var h = 500;

	var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();

    var body = d3.select("#locationGraphDiv");

	//Create SVG element
	var svg = body.append("svg")
            .attr("id","locationGraph")
			.attr("width", w)
			.attr("height", h);

	var key = function(d){
		return d.data._id;
	};

	Deps.autorun(function(){

		var dataset = Location_Map.find().fetch();

		var arcs = svg.selectAll("g.arc")
					  .data(pie(dataset), key);

		var newGroups =
			arcs
				.enter()
				.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

		//Draw arc paths
		newGroups
			.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);

		//Labels
		newGroups
			.append("text")
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(key);

		arcs
			.transition()
			.select('path')
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});

		arcs
			.transition()
			.select('text')
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.text(key);

		arcs
			.exit()
	 		.remove();
	});
}

Template.insightLocations.rendered = function(){
    d3.select("#locationGraph").remove();
    drawLocChart();
};
