export const ResourceCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const resources = [
    // Popular
    { name: "PostgreSQL", icon: "database", category: "Databases", tags: ["database", "nosql"], href: "/quickstart/databases/postgres" },
    { name: "MySQL", icon: "database", category: "Databases", tags: ["database", "nosql"], href: "/quickstart/databases/mysql" },
    { name: "MongoDB", icon: "database", category: "Databases", tags: ["database", "nosql"], href: "/quickstart/databases/mongodb" },
    { name: "SSH", icon: "terminal", category: "Infrastructure Access", tags: ["cli"], href: "/quickstart/ssh" },
    { name: "AWS CLI", icon: "aws", category: "Cloud Services", tags: ["aws", "cli"], href: "/quickstart/cloud-services/aws/aws-cli" },
    { name: "Kubernetes", icon: "kubernetes", category: "Cloud Services", tags: ["containers", "google-cloud"], href: "/quickstart/cloud-services/kubernetes/token" },

    // Cloud Services
    { name: "AWS CloudWatch", icon: "chart-line", category: "Cloud Services", tags: ["aws", "monitoring"], href: "/quickstart/cloud-services/aws/aws-cloudwatch" },
    { name: "AWS ECS", icon: "ship", category: "Cloud Services", tags: ["aws", "containers"], href: "/quickstart/cloud-services/aws/aws-ecs" },
    { name: "AWS SSM", icon: "cog", category: "Cloud Services", tags: ["aws", "automation"], href: "/quickstart/cloud-services/aws/aws-ssm" },

    // Databases
    { name: "Redis", icon: "database", category: "Databases", tags: ["database", "cache", "nosql"], href: "/quickstart/databases/redis" },
    { name: "Oracle", icon: "database", category: "Databases", tags: ["database", "nosql"], href: "/quickstart/databases/oracle" },
    { name: "Microsoft SQL Server", icon: "database", category: "Databases", tags: ["database", "nosql"], href: "/quickstart/databases/mssql" },
    { name: "DynamoDB", icon: "database", category: "Databases", tags: ["database", "nosql", "aws"], href: "/quickstart/databases/dynamodb" },
    { name: "Apache Cassandra", icon: "database", category: "Databases", tags: ["database", "nosql"], href: "/quickstart/databases/apache-cassandra" },
    { name: "BigQuery", icon: "chart-bar", category: "Databases", tags: ["database", "analytics", "google-cloud"], href: "/quickstart/databases/bigquery" },

    // Development Environments
    { name: "Node.js", icon: "node", category: "Development Environments", tags: ["development"], href: "/quickstart/development-environments/nodejs" },
    { name: "Python Scripts", icon: "python", category: "Development Environments", tags: ["python", "development"], href: "/quickstart/development-environments/python/python-scripts" },
    { name: "Django", icon: "python", category: "Development Environments", tags: ["python", "development"], href: "/quickstart/development-environments/python/django-admin" },
    { name: "Ruby on Rails", icon: "gem", category: "Development Environments", tags: ["development"], href: "/quickstart/development-environments/ruby-on-rails" },
    { name: "PHP Artisan", icon: "php", category: "Development Environments", tags: ["development"], href: "/quickstart/development-environments/php-artisan" },
    { name: "Elixir IEx", icon: "code", category: "Development Environments", tags: ["development"], href: "/quickstart/development-environments/elixir-IEx" },
    { name: "Clojure", icon: "code", category: "Development Environments", tags: ["development"], href: "/quickstart/development-environments/clojure" },

    // Web Applications
    { name: "Web Apps & APIs", icon: "globe", category: "Web Applications", tags: ["interactive"], href: "/quickstart/web-applications/webapps-and-apis" },
    { name: "HTTP Proxy", icon: "network-wired", category: "Web Applications", tags: [], href: "/quickstart/web-applications/http-proxy" },
    { name: "Grafana", icon: "chart-line", category: "Web Applications", tags: ["monitoring", "analytics"], href: "/quickstart/web-applications/grafana-proxy" },
    { name: "Kibana", icon: "search", category: "Web Applications", tags: ["monitoring", "analytics", "elasticsearch"], href: "/quickstart/web-applications/kibana-proxy" },
    { name: "TCP", icon: "plug", category: "Web Applications", tags: [], href: "/quickstart/applications/tcp" },

    // Infrastructure Access
    { name: "Remote Desktop (RDP)", icon: "desktop", category: "Infrastructure Access", tags: ["desktop"], href: "/quickstart/applications/remote-desktop" },
  ];

  const allTags = [...new Set(resources.flatMap(r => r.tags))].sort();

  const popular = ["PostgreSQL", "MySQL", "MongoDB", "SSH", "AWS CLI", "Kubernetes"];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => resource.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {});

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const ResourceCard = ({ resource }) => (
    <a
      href={resource.href}
      className="flex flex-col items-center justify-center p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-md min-h-[140px]"
    >
      <div className="text-zinc-600 dark:text-zinc-400 mb-3 text-4xl">
        <Icon icon={resource.icon} />
      </div>
      <div className="text-sm font-medium text-zinc-900 dark:text-white text-center">{resource.name}</div>
    </a>
  );

  return (
    <div className="not-prose">
      {/* Filters Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Search</h3>
          <input
            type="text"
            placeholder="Resources or keywords"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
          />
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                    : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        {/* Popular Section */}
        {!searchQuery && selectedTags.length === 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Popular</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {resources
                .filter(r => popular.includes(r.name))
                .map(resource => (
                  <ResourceCard key={resource.name} resource={resource} />
                ))}
            </div>
          </div>
        )}

        {/* Grouped Resources */}
        {Object.entries(groupedResources).map(([category, categoryResources]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categoryResources.map(resource => (
                <ResourceCard key={resource.name} resource={resource} />
              ))}
            </div>
          </div>
        ))}

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            No resources found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};
