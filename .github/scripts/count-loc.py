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
    fig, ax = plt.subplots(figsize=(12, 8), facecolor='none')  # Set figure background color to none

    # Set a background rectangle with 70% opacity for the entire figure
    fig.patch.set_facecolor('black')
    fig.patch.set_alpha(0.7)

    # Set the background color of the axes (plot area) to black
    ax.set_facecolor((0, 0, 0, 0.7))  # Black with 70% opacity

    bars = ax.barh(sorted_languages, sorted_lines_of_code, color='#01ff07', edgecolor='#01ff07')

    # Set text color to white for labels and title
    ax.set_xlabel('Lines of Code', color='white')
    ax.set_title('Lines of Code by Language', color='white')

    # Set the color of the ticks and labels
    ax.tick_params(axis='both', colors='white')
    ax.xaxis.set_tick_params(labelcolor='white')
    ax.yaxis.set_tick_params(labelcolor='white')

    # Add text labels to each bar with white color
    for bar in bars:
        width = bar.get_width()
        ax.text(width, bar.get_y() + bar.get_height()/2, f'{int(width)}', 
                va='center', ha='left', color='white')

    ax.invert_yaxis()  # Highest values at the top

    # Remove extra padding and borders
    plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.1)
    ax.margins(x=0, y=0)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.spines['bottom'].set_visible(False)

    # Save the chart to a file with black background and 70% transparency
    plt.savefig('LOC_bar_chart.png', facecolor=fig.get_facecolor(), transparent=True, bbox_inches='tight', pad_inches=0)
    plt.close()
    print("Bar chart saved as LOC_bar_chart.png")

def main():
    api_url = "https://api.codetabs.com/v1/loc/?github=LightBlueGamer/Prestigious"  # Replace with your actual API URL
    loc_data = fetch_loc_data(api_url)
    
    if loc_data:
        generate_bar_chart(loc_data)

if __name__ == "__main__":
    main()
