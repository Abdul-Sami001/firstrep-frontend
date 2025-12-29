// app/(site)/careers/page.tsx - Careers Page
'use client';
import { useState } from 'react';
import ContentLayout from '@/components/ContentLayout';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// This would typically come from an API
const jobOpenings = [
  {
    id: '1',
    title: 'Senior Product Designer',
    department: 'Design',
    location: 'London, UK / Remote',
    type: 'Full-time',
    description: 'Lead product design initiatives for our performance apparel line, working closely with athletes and engineers.',
  },
  {
    id: '2',
    title: 'E-commerce Marketing Manager',
    department: 'Marketing',
    location: 'London, UK',
    type: 'Full-time',
    description: 'Drive digital marketing strategies, manage campaigns, and optimize customer acquisition channels.',
  },
  {
    id: '3',
    title: 'Supply Chain Coordinator',
    department: 'Operations',
    location: 'London, UK',
    type: 'Full-time',
    description: 'Manage supplier relationships, ensure quality standards, and optimize our supply chain operations.',
  },
  {
    id: '4',
    title: 'Customer Experience Specialist',
    department: 'Customer Care',
    location: 'Remote',
    type: 'Full-time',
    description: 'Provide exceptional customer support and help build lasting relationships with our community.',
  },
];

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isLoading] = useState(false);

  const departments = ['all', ...Array.from(new Set(jobOpenings.map(job => job.department)))];
  const filteredJobs = selectedDepartment === 'all'
    ? jobOpenings
    : jobOpenings.filter(job => job.department === selectedDepartment);

  return (
    <ContentLayout
      title="Careers at 1stRep"
      description="Join our team and help shape the future of performance apparel. We're always looking for passionate individuals who share our commitment to excellence."
      maxWidth="4xl"
    >
      <div className="space-y-12 md:space-y-16">
        {/* Why Work With Us */}
        <section className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Innovation</h3>
              <p className="text-gray-300 text-base">
                Work on cutting-edge products that push the boundaries of performance apparel technology.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Growth</h3>
              <p className="text-gray-300 text-base">
                Opportunities for professional development and career advancement in a fast-growing company.
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">Culture</h3>
              <p className="text-gray-300 text-base">
                Join a diverse, inclusive team that values collaboration, creativity, and work-life balance.
              </p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Open Positions</h2>
            <div className="flex gap-2 overflow-x-auto">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-[#3c83f6] text-white'
                      : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                  }`}
                >
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 bg-gray-800" />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gray-900/50 rounded-lg p-6 border border-gray-800 hover:border-[#3c83f6] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Briefcase className="h-5 w-5 text-[#3c83f6] mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </span>
                            <span className="bg-[#3c83f6]/20 text-[#3c83f6] px-2 py-1 rounded">
                              {job.department}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                    >
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-lg p-8 text-center">
              <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No positions available in this department at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">
                Check back soon or <a href="/contact-support" className="text-[#3c83f6] hover:text-white underline">contact us</a> to learn about future opportunities.
              </p>
            </div>
          )}
        </section>

        {/* General Application */}
        <section className="bg-gray-900/50 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Don't See a Role That Fits?</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6">
            We're always interested in connecting with talented individuals. Send us your resume and 
            we'll keep you in mind for future opportunities.
          </p>
          <a href="mailto:careers@1strep.com">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white hover:text-black transition-colors"
            >
              Send General Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </section>
      </div>
    </ContentLayout>
  );
}

