import java.io.FileWriter;   // Import the FileWriter class
import java.io.IOException;  // Import the IOException class to handle errors
import java.util.Random;
public class trainDataGenerator {
  public static void main(String[] args) {
    try {
      FileWriter myWriter = new FileWriter("trainData.csv");
      myWriter.write("stay_duration, tour_id\n");          
                    
      int i=0;
      int[] stayDuration = {1,2,3,4,5,6,7,8,9,10,11,12};
      while(i!=200){
        Random r=new Random();        
      	int randomNumber=r.nextInt(stayDuration.length);
      	
        int dur = stayDuration[randomNumber];
        System.out.println(i+" : "+dur);

        switch (dur) {
            case 1:
                    myWriter.write("1, 1 \n");          
                    myWriter.write("1, 2 \n");          
                    break;
            case 2:
                    myWriter.write("2, 1 \n");          
                    myWriter.write("2, 2 \n");          
                    myWriter.write("2, 3 \n");          
                    myWriter.write("2, 4 \n");          
                    break;
            case 3:
                    
                    myWriter.write("3, 2 \n");          
                    myWriter.write("3, 3 \n");          
                    myWriter.write("3, 4 \n");          
                    myWriter.write("3, 5 \n");
                    myWriter.write("3, 6 \n");          
                break;
            case 4:
                    myWriter.write("4, 6 \n");          
                    myWriter.write("4, 3 \n");          
                    myWriter.write("4, 4 \n");          
                    myWriter.write("4, 5 \n");
                    myWriter.write("4, 7 \n");   
                    myWriter.write("4, 8 \n");          
                    myWriter.write("4, 5 \n");
                    myWriter.write("4, 6 \n");   
                    break;
            case 5:
                myWriter.write("5, 6 \n");          
                myWriter.write("5, 3 \n");          
                myWriter.write("5, 4 \n");          
                myWriter.write("5, 5 \n");
                myWriter.write("5, 7 \n");   
                myWriter.write("5, 8 \n");          
                myWriter.write("5, 9 \n");
                myWriter.write("5, 10 \n");   
                break;
            case 6:
                
                myWriter.write("6, 5 \n");          
                myWriter.write("6, 6 \n");          
                myWriter.write("6, 7 \n");          
                myWriter.write("6, 8 \n");
                myWriter.write("6, 9 \n");   
                myWriter.write("6, 10 \n");          
                myWriter.write("6, 11 \n");
                myWriter.write("6, 12 \n");   
                
                break;
            case 7:
                
                myWriter.write("7, 14 \n");          
                myWriter.write("7, 13 \n");          
                myWriter.write("7, 12 \n");          
                myWriter.write("7, 11 \n");
                myWriter.write("7, 7 \n");   
                myWriter.write("7, 8 \n");          
                myWriter.write("7, 9 \n");
                myWriter.write("7, 10 \n");   
                break;
            case 8:
                
                myWriter.write("8, 16 \n");          
                myWriter.write("8, 14 \n");          
                myWriter.write("8, 13 \n");          
                myWriter.write("8, 12 \n");
                myWriter.write("8, 11 \n");   
                myWriter.write("8, 8 \n");          
                myWriter.write("8, 9 \n");
                myWriter.write("8, 10 \n");   
                break;
            case 9:
                
                myWriter.write("9, 18 \n");          
                myWriter.write("9, 17 \n");          
                myWriter.write("9, 16 \n");          
                myWriter.write("9, 15 \n");
                myWriter.write("9, 14 \n");   
                myWriter.write("9, 13 \n");          
                myWriter.write("9, 12 \n");
                myWriter.write("9, 11 \n");   
                break;
            case 10:
                
                myWriter.write("10, 20 \n");          
                myWriter.write("10, 19 \n");          
                myWriter.write("10, 18 \n");          
                myWriter.write("10, 17 \n");
                myWriter.write("10, 16 \n");   
                myWriter.write("10, 15 \n");          
                myWriter.write("10, 14 \n");
                myWriter.write("10, 13 \n");   
                break;
        
            default:
                break;
        }


        //if stay duration 1 day = 1 day tour
        //if 2 ... 2,1
        //if 3 .. 2,1
        //4 3,2,1
        //5 4,3,2,1
        //6  
        i+=1;
      }
      
      
      myWriter.close();
      System.out.println("Successfully wrote to the file.");
    } catch (IOException e) {
      System.out.println("An error occurred.");
      e.printStackTrace();
    }
  }
}