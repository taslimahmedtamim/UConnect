"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export default function SkillRadarChart({ 
  skills = [],
  title = "",
  target = "",
}: { 
  skills?: string[],
  title?: string,
  target?: string,
}) {
  const lowerSkills = skills.map(s => s.toLowerCase());
  const lowerTarget = (target || title || "").toLowerCase();

  // Define dynamic axes based on the target role
  const getRoleData = () => {
    if (lowerTarget.includes('data') || lowerTarget.includes('ai') || lowerTarget.includes('machine') || lowerTarget.includes('scientist')) {
      return [
        { subject: 'Python/R', keywords: ['python', 'r', 'programming'] },
        { subject: 'Machine Learning', keywords: ['machine learning', 'ml', 'scikit', 'model'] },
        { subject: 'Data Analysis', keywords: ['data', 'analysis', 'pandas', 'numpy', 'visualization', 'tableau'] },
        { subject: 'SQL/NoSQL', keywords: ['sql', 'database', 'nosql', 'mongo', 'postgres'] },
        { subject: 'Deep Learning', keywords: ['deep learning', 'tensorflow', 'pytorch', 'keras', 'neural'] },
        { subject: 'Statistics', keywords: ['statistics', 'math', 'probability', 'a/b testing'] },
      ];
    }
    if (lowerTarget.includes('front') || lowerTarget.includes('ui') || lowerTarget.includes('web')) {
      return [
        { subject: 'React/Vue', keywords: ['react', 'vue', 'angular', 'next', 'nuxt'] },
        { subject: 'JavaScript/TS', keywords: ['javascript', 'js', 'typescript', 'ts'] },
        { subject: 'HTML/CSS', keywords: ['html', 'css', 'tailwind', 'sass', 'bootstrap'] },
        { subject: 'UI/UX', keywords: ['ui', 'ux', 'design', 'figma', 'responsive'] },
        { subject: 'State Mgmt', keywords: ['redux', 'zustand', 'context', 'pinia', 'state'] },
        { subject: 'Web Perf', keywords: ['performance', 'optimization', 'seo', 'lighthouse', 'webpack', 'vite'] },
      ];
    }
    if (lowerTarget.includes('back') || lowerTarget.includes('api')) {
      return [
        { subject: 'Node/Python', keywords: ['node', 'python', 'java', 'c#', 'go', 'php', 'ruby'] },
        { subject: 'Databases', keywords: ['sql', 'postgres', 'mongo', 'redis', 'database', 'orm'] },
        { subject: 'API Design', keywords: ['api', 'rest', 'graphql', 'grpc', 'swagger'] },
        { subject: 'Auth/Security', keywords: ['auth', 'jwt', 'oauth', 'security', 'crypto'] },
        { subject: 'Microservices', keywords: ['microservices', 'docker', 'kubernetes', 'kafka', 'rabbitmq'] },
        { subject: 'Cloud/Deploy', keywords: ['aws', 'azure', 'gcp', 'ci/cd', 'deployment', 'serverless'] },
      ];
    }
    if (lowerTarget.includes('mobile') || lowerTarget.includes('app')) {
      return [
        { subject: 'React Native', keywords: ['react native', 'flutter', 'dart', 'cross-platform'] },
        { subject: 'iOS/Swift', keywords: ['ios', 'swift', 'objective-c', 'apple'] },
        { subject: 'Android/Kotlin', keywords: ['android', 'kotlin', 'java', 'mobile'] },
        { subject: 'Mobile UI', keywords: ['ui', 'animation', 'responsive', 'layout', 'design'] },
        { subject: 'Offline/Sync', keywords: ['sqlite', 'realm', 'coredata', 'offline', 'sync'] },
        { subject: 'App Store', keywords: ['app store', 'play store', 'publishing', 'fastlane'] },
      ];
    }
    if (lowerTarget.includes('devops') || lowerTarget.includes('cloud') || lowerTarget.includes('sysadmin')) {
      return [
        { subject: 'AWS/Azure/GCP', keywords: ['aws', 'azure', 'gcp', 'cloud'] },
        { subject: 'CI/CD', keywords: ['ci/cd', 'jenkins', 'github actions', 'gitlab', 'pipeline'] },
        { subject: 'Containers', keywords: ['docker', 'kubernetes', 'k8s', 'containers'] },
        { subject: 'Linux/OS', keywords: ['linux', 'bash', 'shell', 'unix', 'ubuntu'] },
        { subject: 'Infrastructure', keywords: ['terraform', 'ansible', 'iac', 'infrastructure', 'cloudformation'] },
        { subject: 'Monitoring', keywords: ['monitoring', 'prometheus', 'grafana', 'elk', 'datadog', 'logging'] },
      ];
    }
    if (lowerTarget.includes('sec') || lowerTarget.includes('cyber') || lowerTarget.includes('soc')) {
      return [
        { subject: 'Network Sec', keywords: ['network', 'firewall', 'wireshark', 'cisco', 'packet'] },
        { subject: 'Pentesting', keywords: ['pentest', 'ethical hacking', 'kali', 'metasploit', 'burp'] },
        { subject: 'Cryptography', keywords: ['crypto', 'encryption', 'pki', 'ssl', 'tls'] },
        { subject: 'Risk/Compliance', keywords: ['risk', 'compliance', 'iso', 'gdpr', 'audit', 'policy'] },
        { subject: 'Cloud Sec', keywords: ['cloud security', 'aws security', 'iam', 'waf'] },
        { subject: 'App Sec', keywords: ['appsec', 'owasp', 'sast', 'dast', 'secure coding'] },
      ];
    }
    // Default fallback
    return [
      { subject: 'Frontend', keywords: ['react', 'html', 'css', 'ui', 'front'] },
      { subject: 'Backend', keywords: ['node', 'python', 'sql', 'api', 'back'] },
      { subject: 'Mobile', keywords: ['android', 'ios', 'flutter', 'mobile'] },
      { subject: 'Cloud/DevOps', keywords: ['aws', 'cloud', 'docker', 'devops'] },
      { subject: 'Security', keywords: ['security', 'cyber', 'network'] },
      { subject: 'AI/Data', keywords: ['ai', 'machine learning', 'data'] },
    ];
  };

  const roleCategories = getRoleData();

  // Calculate score for each category based on user skills
  const data = roleCategories.map(cat => {
    let score = 20; // Base score
    
    // Add points for matching skills
    lowerSkills.forEach(skill => {
      if (cat.keywords.some(kw => skill.includes(kw) || kw.includes(skill))) {
        score += 30; // Significant boost for direct matches
      }
    });

    // Add points for target role matching the category generally
    if (cat.keywords.some(kw => lowerTarget.includes(kw))) {
      score += 20;
    }

    return {
      subject: cat.subject,
      A: Math.min(score, 100),
      fullMark: 100
    };
  });

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Proficiency" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.4} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' }}
            itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
