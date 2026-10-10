/**
 * Constants
 */

export const ACTIVITY_TYPES = [
  { value: 'conference', label: 'Conference' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'competition', label: 'Competition' },
  { value: 'certification', label: 'Certification' },
  { value: 'project', label: 'Project' },
  { value: 'internship', label: 'Internship' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'volunteering', label: 'Volunteering' },
  { value: 'community_service', label: 'Community Service' },
  { value: 'club_activity', label: 'Club Activity' },
  { value: 'publication', label: 'Publication' },
  { value: 'other', label: 'Other' },
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const POINTS_SCALE = {
  conference: 80,
  seminar: 40,
  workshop: 30,
  competition: 75,
  certification: 50,
  project: 100,
  internship: 150,
  leadership: 60,
  volunteering: 50,
  community_service: 45,
  club_activity: 35,
  publication: 200,
  other: 10,
};
