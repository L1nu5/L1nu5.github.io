// Data service to manage all portfolio data from JSON files
import configData from '../data/config.json';
import musicEventsData from '../data/musicEvents.json';
import educationData from '../data/education.json';
import resumeData from '../data/resume.json';
import socialsData from '../data/socials.json';

class DataService {
  constructor() {
    this.config = configData;
    this.musicEvents = musicEventsData;
    this.education = educationData;
    this.resume = resumeData;
    this.socials = socialsData;
  }

  // Configuration methods
  getConfig() {
    return this.config;
  }

  getPersonalInfo() {
    return this.config.personal;
  }

  getTheme() {
    return this.config.theme;
  }

  getNavigation() {
    return this.config.navigation;
  }

  getHomeContent() {
    return this.config.home;
  }

  getFooterContent() {
    return this.config.footer;
  }

  getSEOData() {
    return this.config.seo;
  }

  // Music Events methods
  getMusicEvents() {
    return this.musicEvents;
  }

  getUpcomingEvents() {
    return this.musicEvents.upcomingEvents;
  }

  getPastEvents() {
    return this.musicEvents.pastEvents;
  }

  getMusicSettings() {
    return this.musicEvents.settings;
  }

  getMusicStats() {
    const pastEvents = this.getPastEvents();
    const settings = this.getMusicSettings();
    
    return {
      concertsAttended: pastEvents.length,
      festivalsExperienced: pastEvents.filter(event => event.type === 'Festival').length,
      averageRating: (pastEvents.reduce((sum, event) => sum + event.rating, 0) / pastEvents.length).toFixed(1),
      favoriteGenre: settings.favoriteGenre,
      bestConcert: settings.bestConcertEver,
      totalConcertsAttended: settings.totalConcertsAttended,
      totalFestivalsAttended: settings.totalFestivalsAttended
    };
  }

  // Education methods
  getEducation() {
    return this.education;
  }

  getEducationPhilosophy() {
    return this.education.philosophy;
  }

  getInstitutions() {
    return this.education.institutions;
  }

  getSkills() {
    return this.education.skills;
  }

  getCertifications() {
    return this.education.certifications;
  }

  getSkillsByCategory() {
    const skills = this.getSkills();
    const categories = {};
    
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });
    
    return categories;
  }

  // Resume methods
  getResume() {
    return this.resume;
  }

  getResumePersonalInfo() {
    return this.resume.personalInfo;
  }

  getSummary() {
    return this.resume.summary;
  }

  getWorkExperience() {
    return this.resume.workExperience;
  }

  getProjects() {
    return this.resume.projects;
  }

  getResumeSkills() {
    return this.resume.skills;
  }

  getDownloadLinks() {
    return this.resume.downloadLinks;
  }

  // Socials methods
  getSocials() {
    return this.socials;
  }

  getSocialLinks() {
    return this.socials.socialLinks;
  }

  getContactInfo() {
    return this.socials.contactInfo;
  }

  getSocialStats() {
    return this.socials.socialStats;
  }

  getFeaturedContent() {
    return this.socials.featuredContent;
  }

  getSocialsDescription() {
    return this.socials.description;
  }

  // Utility methods
  getEventById(id) {
    const allEvents = [...this.getUpcomingEvents(), ...this.getPastEvents()];
    return allEvents.find(event => event.id === id);
  }

  getProjectById(id) {
    return this.getProjects().find(project => project.id === id);
  }

  getInstitutionById(id) {
    return this.getInstitutions().find(institution => institution.id === id);
  }

  getSocialLinkByPlatform(platform) {
    return this.getSocialLinks().find(link => 
      link.platform.toLowerCase() === platform.toLowerCase()
    );
  }

  // Search and filter methods
  searchEvents(query) {
    const allEvents = [...this.getUpcomingEvents(), ...this.getPastEvents()];
    return allEvents.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.venue.toLowerCase().includes(query.toLowerCase()) ||
      event.type.toLowerCase().includes(query.toLowerCase())
    );
  }

  filterEventsByType(type) {
    const allEvents = [...this.getUpcomingEvents(), ...this.getPastEvents()];
    return allEvents.filter(event => event.type === type);
  }

  filterEventsByRating(minRating) {
    return this.getPastEvents().filter(event => event.rating >= minRating);
  }

  // Data validation methods
  validateData() {
    const errors = [];
    
    // Validate required fields
    if (!this.config.personal.name) {
      errors.push('Personal name is required in config.json');
    }
    
    if (!this.config.personal.email) {
      errors.push('Personal email is required in config.json');
    }
    
    // Validate music events
    this.musicEvents.upcomingEvents.forEach((event, index) => {
      if (!event.title || !event.date || !event.venue) {
        errors.push(`Upcoming event at index ${index} is missing required fields`);
      }
    });
    
    this.musicEvents.pastEvents.forEach((event, index) => {
      if (!event.title || !event.date || !event.venue || !event.rating) {
        errors.push(`Past event at index ${index} is missing required fields`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Export methods for backup/sharing
  exportAllData() {
    return {
      config: this.config,
      musicEvents: this.musicEvents,
      education: this.education,
      resume: this.resume,
      socials: this.socials,
      exportDate: new Date().toISOString()
    };
  }

  exportMusicData() {
    return {
      musicEvents: this.musicEvents,
      exportDate: new Date().toISOString()
    };
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService;

// Also export the class for testing purposes
export { DataService };
