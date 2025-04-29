import { z } from '@builder.io/qwik-city';
import OpenAI from 'openai';

export const MarketValueAverage = z.object({
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    average: z.number(),
    currency: z.string(),
});


class OpenAIUtils {
    private apiKey: string;
    private client: OpenAI;
    private static instance: OpenAIUtils | null = null;

    private constructor() {
        this.apiKey = import.meta.env.VITE_OPENAI_SECRET_KEY;
        this.client = new OpenAI({
            apiKey: this.apiKey,
        });
    }

    public static getInstance(): OpenAIUtils {
        if (!OpenAIUtils.instance) {
            OpenAIUtils.instance = new OpenAIUtils();
        }
        return OpenAIUtils.instance;
    }

    async getMarketValue(req: any): Promise<{
        success: boolean;
        data: {
            minPrice: number | null;
            maxPrice: number | null;
            average: number;
            currency: string;
        };
        message?: string;
    }> {
        let data = "";
        const prompt = `What is the max market value and min market value and average market value of a ${req.data.year} ${req.data.make} ${req.data.model} ${req.data.trim} in Egypt in ${
            // current year
            new Date().getFullYear()
            }?
          Response format json {price: "1000", currency: "EGP"}
          `;
        try {
            const response = await this.client.responses.create({
                model: "gpt-4o-mini",
                tools: [{ type: "web_search_preview" }],
                input: prompt,
                temperature: 0,
            });
            data = response.output_text;
        } catch (error: any) {
            console.error("Error fetching data from OpenAI:", error);
        }

        const cleanPrompt = `
          From the following text, extract the JSON object:
          ${data}
          ** If the text does not contain a JSON object, return an empty array.
          ** If min and max are equal to each other, return null for min and max.
          `;

        try {

            const response2 = await this.client.beta.chat.completions.parse({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: cleanPrompt,
                    },
                ],
                temperature: 0,
                zodResponseFormat: MarketValueAverage,
            });
            const marketValue: any = response2.choices[0].message.content;

            const jsonMarketValue = JSON.parse(marketValue);
            req.data.marketValue = {
                minPrice: jsonMarketValue.minPrice,
                maxPrice: jsonMarketValue.maxPrice,
                average: jsonMarketValue.average,
                currency: jsonMarketValue.currency,
            };
            req.data.success = true;
            return req.data;
        } catch (error: any) {
            console.error("Error parsing response:", error);
            req.data.success = false;
            req.data.message = "Error parsing response";
            return req.data;
        }

    }
}

export default OpenAIUtils;