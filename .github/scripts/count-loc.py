import requests
import matplotlib.pyplot as plt

# Fetch LOC data from CodeTabs API
repo_url = "https://github.com/YOUR_USERNAME/YOUR_REPOSITORY"
response = requests.get(f"https://api.codetabs.com/v1/loc?source={repo_url}")

# Check if the request was successful
if response.status_code != 200:
    print(f"Failed to fetch data: {response.status_code}")
    print(response.text)
    exit(1)

# Parse the JSON response
loc_data = response.json()

# Print the response for debugging
print(loc_data)

# Extract data for plotting, excluding the "Total" entry
languages = [entry['language'] for entry in loc_data if entry['language'] != 'Total']
loc_counts = [entry['linesOfCode'] for entry in loc_data if entry['language'] != 'Total']

# Create pie chart
plt.figure(figsize=(10, 7))
plt.pie(loc_counts, labels=languages, autopct='%1.1f%%', startangle=140)
plt.title('Lines of Code by Language')
plt.savefig('LOC_pie_chart.png')  # Ensure the path is correct

# Update README.md
with open('README.md', 'r') as file:
    readme_content = file.read()

updated_content = readme_content.replace(
    '<!-- LOC_PIE_CHART -->',
    '![](LOC_pie_chart.png)'
)

with open('README.md', 'w') as file:
    file.write(updated_content)
