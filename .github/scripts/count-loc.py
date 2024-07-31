import requests
import matplotlib.pyplot as plt

def fetch_loc_data(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: Failed to fetch data from API (Status Code: {response.status_code})")
        return None

def generate_bar_chart(data):
    # Extract languages and lines of code
    try:
        languages = [entry['language'] for entry in data if entry['language'] != 'Total']
        lines_of_code = [entry['linesOfCode'] for entry in data if entry['language'] != 'Total']
    except KeyError as e:
        print(f"Error: Missing key in data - {e}")
        return

    # Sort data for better visualization
    sorted_data = sorted(zip(languages, lines_of_code), key=lambda x: x[1], reverse=True)
    sorted_languages, sorted_lines_of_code = zip(*sorted_data)

    # Create a bar chart
    plt.figure(figsize=(12, 8))
    plt.barh(sorted_languages, sorted_lines_of_code, color='skyblue', edgecolor='white')
    plt.xlabel('Lines of Code', color='white')
    plt.title('Lines of Code by Language', color='white')
    plt.gca().invert_yaxis()  # Highest values at the top
    
    # Save the chart to a file
    plt.savefig('LOC_bar_chart.png', transparent=True, bbox_inches='tight')
    plt.close()
    print("Bar chart saved as LOC_bar_chart.png")

def main():
    api_url = "https://api.codetabs.com/v1/loc/?github=LightBlueGamer/Prestigious"  # Replace with your actual API URL
    loc_data = fetch_loc_data(api_url)
    
    if loc_data:
        generate_bar_chart(loc_data)

if __name__ == "__main__":
    main()
