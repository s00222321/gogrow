export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
    };
  
    const formattedDate = new Date(dateString).toLocaleString("en-US", options);
    return formattedDate;
  };
  