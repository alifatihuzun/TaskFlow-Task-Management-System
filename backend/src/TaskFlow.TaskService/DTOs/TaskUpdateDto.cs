using System.ComponentModel.DataAnnotations;

namespace TaskFlow.TaskService.DTOs;

public class TaskUpdateDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Priority { get; set; } = "Medium";

    [Required]
    public string Status { get; set; } = "Todo";

    public DateTime? DueDate { get; set; }
}
