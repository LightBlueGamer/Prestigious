import requests
import matplotlib.pyplot as plt

# Fetch LOC data from CodeTabs API
repo_url = "https://github.com/LightBlueGamer/Prestigious"
response = requests.get(f"https://api.codetabs.com/v1/loc?source={repo_url}")
loc_data = response.json()

# Extract data for plotting
languages = [entry['language'] for entry in loc_data]
loc_counts = [entry['linesOfCode'] for entry in loc_data]

# Create pie chart
plt.figure(figsize=(10, 7))
plt.pie(loc_counts, labels=languages, autopct='%1.1f%%', startangle=140)
plt.title('Lines of Code by Language')
plt.savefig('LOC_pie_chart.png')

# Update README.md
with open('README.md', 'r') as file:
    readme_content = file.read()

updated_content = readme_content.replace(
    '<!-- LOC_PIE_CHART -->',
    '![](LOC_pie_chart.png)'
)

with open('README.md', 'w') as file:
    file.write(updated_content)
