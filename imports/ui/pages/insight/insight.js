import './insight.html';
import '../../components/insightpage/insightpage.js';

Template.Insight.onRendered(function(){
    Session.set('showThings', false);
    Session.set('searchTerm',"");
});

Template.Insight.helpers({
    showDivs:function(){
        return Session.get('showThings');
    }
});
