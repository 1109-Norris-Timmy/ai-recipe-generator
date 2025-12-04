export function request(ctx) {
    const { ingredients = [] } = ctx.args;
    
    // Construct the prompt with the provided ingredients
    const prompt = "Suggest a recipe idea using these ingredients: " + ingredients.join(", ") + ".";
    
    // Return the request configuration
    return {
        resourcePath: "/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke",
        method: "POST",
        params: {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Human: " + prompt + "\n\nAssistant:",
                            },
                        ],
                    },
                ],
            }),
        },
    };
}

export function response(ctx) {
    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);
    
    // Extract the text content from the response with error handling
    let bodyText = "No response content available";
    
    try {
        if (parsedBody && parsedBody.content && Array.isArray(parsedBody.content) && parsedBody.content.length > 0) {
            if (parsedBody.content[0] && parsedBody.content[0].text) {
                bodyText = parsedBody.content[0].text;
            }
        }
    } catch (error) {
        bodyText = "Error parsing response: " + error.message;
    }
    
    return {
        body: bodyText,
    };
}

