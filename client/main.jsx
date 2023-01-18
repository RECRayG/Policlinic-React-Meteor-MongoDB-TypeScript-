import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';
import { BrowserRouter } from 'react-router-dom';

Meteor.startup(() => {
    Meteor.subscribe('doctors');
    Meteor.subscribe('timetable');
    Meteor.subscribe('patients');
    Meteor.subscribe('receptions');
    Meteor.subscribe('analyses');
    Meteor.subscribe('medications');
  render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById('react-target')
  );
});
