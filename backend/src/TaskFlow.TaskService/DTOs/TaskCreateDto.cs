using System.ComponentModel.DataAnnotations;

namespace TaskFlow.TaskService.DTOs;

public class TaskCreateDto
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Priority { get; set; } = "Medium";

    public DateTime? DueDate { get; set; }
}
